import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Mic, MicOff, Loader2, FileText, Volume2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceWaveform } from "@/components/VoiceWaveform";
import { useVoiceChat, type VoiceStatus } from "@/hooks/useVoiceChat";

const STATUS_LABELS: Record<VoiceStatus, string> = {
  idle: "タップして音声会話を開始",
  connecting: "接続中...",
  ready: "どうぞ、話しかけてください",
  listening: "聞いています...",
  processing: "考え中...",
  ai_speaking: "AIが話しています",
  generating: "報告書を生成中...",
  done: "完了！",
  error: "エラーが発生しました",
};

const STATUS_ICON: Partial<Record<VoiceStatus, string>> = {
  idle: "🎙️",
  connecting: "⏳",
  ready: "✨",
  listening: "👂",
  processing: "🤔",
  ai_speaking: "🗣️",
  generating: "📝",
  done: "✅",
  error: "⚠️",
};

export default function VoicePage() {
  const [, setLocation] = useLocation();
  const { status, transcript, error, result, start, stop } = useVoiceChat();
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Navigate to preview when report is ready
  useEffect(() => {
    if (result) {
      const { report, reportType, basicInfo } = result;
      sessionStorage.setItem(
        "voiceReportData",
        JSON.stringify({ report, reportType, basicInfo })
      );
      // Short delay so user sees "done" state
      const t = setTimeout(() => {
        setLocation(`/voice/preview`);
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [result, setLocation]);

  const isActive =
    status !== "idle" && status !== "done" && status !== "error";
  const isConnecting = status === "connecting";
  const isGenerating = status === "generating";

  const handleMainButton = () => {
    if (status === "idle" || status === "error") {
      start();
    } else if (isActive) {
      stop();
      // reset status to idle is handled by hook
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-2 text-white/80">
          <Sparkles className="h-4 w-4 text-violet-400" />
          <span className="text-sm font-medium">音声で報告書作成</span>
        </div>
        <div className="flex items-center gap-2 text-white/40 text-xs">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          OpenAI Realtime API
        </div>
      </div>

      <div className="flex flex-col flex-1 max-w-2xl mx-auto w-full px-4 py-6 gap-6">
        {/* Status & waveform card */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 flex flex-col items-center gap-4">
          {/* Status emoji */}
          <div className="text-4xl select-none">{STATUS_ICON[status]}</div>

          {/* Waveform */}
          <VoiceWaveform status={status} />

          {/* Status label */}
          <p className="text-white/70 text-sm font-medium text-center">
            {STATUS_LABELS[status]}
          </p>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-300 text-sm w-full">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Main button */}
          <Button
            onClick={handleMainButton}
            disabled={isConnecting || isGenerating || status === "done"}
            size="lg"
            className={`mt-2 rounded-full w-20 h-20 text-white shadow-lg transition-all duration-300 ${
              isActive && !isConnecting && !isGenerating
                ? "bg-red-500 hover:bg-red-600 scale-105"
                : status === "done"
                ? "bg-emerald-500"
                : "bg-violet-600 hover:bg-violet-500"
            }`}
          >
            {isConnecting || isGenerating ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : isActive ? (
              <MicOff className="h-8 w-8" />
            ) : status === "done" ? (
              <FileText className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>

          {isActive && !isConnecting && !isGenerating && (
            <p className="text-white/30 text-xs">タップで停止</p>
          )}
        </div>

        {/* How it works (idle state) */}
        {status === "idle" && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
            <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">
              使い方
            </p>
            <div className="space-y-2 text-sm text-white/50">
              {[
                "マイクボタンを押して会話を開始",
                "AIが富山弁で報告書タイプ・基本情報を確認",
                "内容についての質問に答えるだけ（全10問程度）",
                "完了すると自動で報告書が生成されます",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-violet-500/30 text-violet-300 text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transcript */}
        {transcript.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
              <Volume2 className="h-4 w-4 text-white/40" />
              <span className="text-white/50 text-xs font-medium">会話の記録</span>
            </div>
            <div className="max-h-72 overflow-y-auto px-4 py-3 space-y-3">
              {transcript.map((entry) => (
                <div
                  key={entry.id}
                  className={`flex gap-2 ${
                    entry.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {entry.role === "assistant" && (
                    <div className="shrink-0 w-6 h-6 rounded-full bg-violet-500/30 flex items-center justify-center text-xs">
                      🤖
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] text-sm rounded-2xl px-3 py-2 leading-relaxed ${
                      entry.role === "user"
                        ? "bg-emerald-500/20 text-emerald-100 rounded-tr-none"
                        : "bg-white/10 text-white/80 rounded-tl-none"
                    } ${entry.partial ? "opacity-60" : ""}`}
                  >
                    {entry.text}
                  </div>
                  {entry.role === "user" && (
                    <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center text-xs">
                      🧑
                    </div>
                  )}
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>
          </div>
        )}

        {/* Generating overlay */}
        {isGenerating && (
          <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-5 flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-violet-400 animate-spin shrink-0" />
            <div>
              <p className="text-violet-200 text-sm font-medium">
                報告書を生成しています...
              </p>
              <p className="text-violet-400/60 text-xs mt-0.5">
                会話内容をもとにAIが整理中です
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
