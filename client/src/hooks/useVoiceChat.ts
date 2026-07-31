import { useState, useRef, useCallback, useEffect } from "react";

export type VoiceStatus =
  | "idle"
  | "connecting"
  | "ready"
  | "listening"
  | "processing"
  | "ai_speaking"
  | "generating"
  | "done"
  | "error";

export interface TranscriptEntry {
  id: string;
  role: "user" | "assistant";
  text: string;
  partial?: boolean;
}

export interface ReportResult {
  report: Record<string, unknown>;
  reportType: "trip" | "seminar" | "defect";
  basicInfo: Record<string, string>;
}

interface UseVoiceChatReturn {
  status: VoiceStatus;
  transcript: TranscriptEntry[];
  error: string | null;
  result: ReportResult | null;
  start: () => Promise<void>;
  stop: () => void;
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function pcm16ToFloat32(buffer: ArrayBuffer): Float32Array {
  const int16 = new Int16Array(buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 0x8000;
  }
  return float32;
}

export function useVoiceChat(): UseVoiceChatReturn {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReportResult | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const partialIdRef = useRef<string | null>(null);
  const audioQueueRef = useRef<AudioBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const nextPlayTimeRef = useRef(0);

  const appendTranscript = useCallback(
    (role: "user" | "assistant", text: string, id?: string) => {
      const entryId = id || `${role}-${Date.now()}-${Math.random()}`;
      setTranscript((prev) => [
        ...prev.filter((e) => e.id !== entryId || !e.partial),
        { id: entryId, role, text, partial: false },
      ]);
      return entryId;
    },
    []
  );

  const updatePartialTranscript = useCallback(
    (role: "user" | "assistant", delta: string, id: string) => {
      setTranscript((prev) => {
        const existing = prev.find((e) => e.id === id);
        if (existing) {
          return prev.map((e) =>
            e.id === id ? { ...e, text: e.text + delta, partial: true } : e
          );
        }
        return [
          ...prev,
          { id, role, text: delta, partial: true },
        ];
      });
    },
    []
  );

  // Schedule and play a decoded PCM AudioBuffer
  const scheduleAudio = useCallback((buffer: AudioBuffer) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    const now = ctx.currentTime;
    const startAt = Math.max(now, nextPlayTimeRef.current);
    source.start(startAt);
    nextPlayTimeRef.current = startAt + buffer.duration;
  }, []);

  const handleAudioDelta = useCallback(
    (base64: string) => {
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const arrayBuffer = base64ToArrayBuffer(base64);
      const float32 = pcm16ToFloat32(arrayBuffer);

      // OpenAI sends 24kHz mono PCM16
      const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
      audioBuffer.copyToChannel(float32, 0);
      scheduleAudio(audioBuffer);
    },
    [scheduleAudio]
  );

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    nextPlayTimeRef.current = 0;
    isPlayingRef.current = false;
    audioQueueRef.current = [];
  }, []);

  const start = useCallback(async () => {
    try {
      setStatus("connecting");
      setError(null);
      setTranscript([]);
      setResult(null);
      partialIdRef.current = null;
      nextPlayTimeRef.current = 0;

      // 1. AudioContext at 24 kHz (matches OpenAI output; browser resamples mic input)
      const ctx = new AudioContext({ sampleRate: 24000 });
      audioCtxRef.current = ctx;

      // 2. Load AudioWorklet
      await ctx.audioWorklet.addModule("/pcm-processor.js");

      // 3. Microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 24000,
        },
      });
      streamRef.current = stream;

      // 4. WebSocket
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws/voice-chat`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[useVoiceChat] WS connected");

        // 5. Wire microphone → AudioWorklet → WebSocket
        const source = ctx.createMediaStreamSource(stream);
        const workletNode = new AudioWorkletNode(ctx, "pcm-processor");
        workletNodeRef.current = workletNode;

        workletNode.port.onmessage = (e: MessageEvent<ArrayBuffer>) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          // Convert ArrayBuffer to base64
          const bytes = new Uint8Array(e.data);
          let binary = "";
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binary);
          ws.send(JSON.stringify({ type: "audio", audio: base64 }));
        };

        source.connect(workletNode);
        // Do NOT connect workletNode to destination (we don't want mic feedback)
      };

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);

          switch (msg.type) {
            case "status": {
              if (msg.event === "ready") setStatus("ready");
              else if (msg.event === "speech_started") setStatus("listening");
              else if (msg.event === "speech_stopped") setStatus("processing");
              else if (msg.event === "ai_speaking_start") setStatus("ai_speaking");
              else if (msg.event === "ai_speaking_end") setStatus("ready");
              break;
            }

            case "audio": {
              handleAudioDelta(msg.delta);
              break;
            }

            case "transcript_delta": {
              if (msg.role === "assistant") {
                if (!partialIdRef.current) {
                  partialIdRef.current = `assistant-${Date.now()}`;
                }
                updatePartialTranscript("assistant", msg.delta, partialIdRef.current);
              }
              break;
            }

            case "transcript_done": {
              if (msg.role === "assistant") {
                const id = partialIdRef.current || `assistant-${Date.now()}`;
                appendTranscript("assistant", msg.text, id);
                partialIdRef.current = null;
              } else {
                appendTranscript("user", msg.text);
              }
              break;
            }

            case "generating_report": {
              setStatus("generating");
              break;
            }

            case "report_complete": {
              setStatus("done");
              setResult({
                report: msg.report,
                reportType: msg.reportType,
                basicInfo: msg.basicInfo,
              });
              stop();
              break;
            }

            case "error": {
              setError(msg.message);
              setStatus("error");
              stop();
              break;
            }
          }
        } catch {
          // ignore parse errors
        }
      };

      ws.onerror = () => {
        setError("WebSocket接続エラーが発生しました。");
        setStatus("error");
        stop();
      };

      ws.onclose = () => {
        if (status !== "done" && status !== "error") {
          setStatus("idle");
        }
      };
    } catch (err) {
      console.error("[useVoiceChat] start error:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "マイクへのアクセスに失敗しました。";
      setError(msg);
      setStatus("error");
      stop();
    }
  }, [handleAudioDelta, updatePartialTranscript, appendTranscript, stop, status]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { status, transcript, error, result, start, stop };
}
