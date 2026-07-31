import { WebSocket, WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import { generateReport } from "./report-generator";

const OPENAI_REALTIME_URL =
  "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview";

const VOICE_SYSTEM_PROMPT = `あなたは富山弁を話す報告書作成AIアシスタントです。音声だけで報告書に必要なすべての情報を収集します。

## 進め方（必ずこの順序で）

### ステップ1：あいさつ＆報告書タイプ確認（1問）
- 富山弁で温かくあいさつする
- 「出張報告書」「セミナー参加報告書」「不良品報告書」のどれを作るか聞く

### ステップ2：基本情報収集（2〜3問）
**出張報告書の場合：**
- 報告者名、出張先、出張期間を確認

**セミナー参加報告書の場合：**
- 報告者名、セミナー名、開催日を確認

**不良品報告書の場合：**
- 報告者名、対象製品・工程、発生日を確認

### ステップ3：内容インタビュー（4〜6問）
**出張報告書：**
1. 出張の主な目的
2. 訪問先・実施した活動の内容
3. 得られた成果・達成できたこと
4. 課題・問題点
5. 今後のアクション・フォローアップ

**セミナー参加報告書：**
1. セミナーの主な内容・テーマ
2. 特に印象に残った学び
3. 気づき・新たな発見
4. 業務への活用方法

**不良品報告書：**
1. 不良の具体的な内容・症状
2. 4M分析（Man/Machine/Material/Method）の各要因
3. なぜなぜ分析（なぜを5回繰り返して真因を特定）
4. 応急処置と恒久対策

### ステップ4：締めくくり
- 情報が揃ったら感謝の言葉を富山弁で言う
- finish_interviewを呼び出す（必ず呼ぶ）

## 富山弁の特徴
- 語尾：「〜がけ？」「〜がいぜ」「〜ちゃ」「〜ながいぜ」「〜がね」
- 表現：「そんがん」「こんがん」「なんにもんも」「おつかれさんやったがいぜ」
- 温かく親しみやすい話し方

## 重要なルール
- 一度に1つだけ質問する
- 相手の回答に必ず共感・受け止めてから次の質問へ
- 質問は合計8〜10問で終わる
- 十分な情報が揃ったら必ずfinish_interviewを呼び出す`;

interface Transcript {
  role: "user" | "assistant";
  content: string;
}

export function setupVoiceChat(wss: WebSocketServer) {
  wss.on("connection", (browserWs: WebSocket, _req: IncomingMessage) => {
    console.log("[VoiceChat] Browser connected");

    const transcript: Transcript[] = [];
    let currentAssistantText = "";

    // Connect to OpenAI Realtime API
    const apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_API;
    if (!apiKey) {
      sendToBrowser({ type: "error", message: "OpenAI APIキーが設定されていません。管理者に連絡してください。" });
      browserWs.close();
      return;
    }

    const openaiWs = new WebSocket(OPENAI_REALTIME_URL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const sendToBrowser = (payload: object) => {
      if (browserWs.readyState === WebSocket.OPEN) {
        browserWs.send(JSON.stringify(payload));
      }
    };

    const sendToOpenAI = (payload: object) => {
      if (openaiWs.readyState === WebSocket.OPEN) {
        openaiWs.send(JSON.stringify(payload));
      }
    };

    openaiWs.on("open", () => {
      console.log("[VoiceChat] Connected to OpenAI Realtime API");

      // Configure session
      sendToOpenAI({
        type: "session.update",
        session: {
          modalities: ["text", "audio"],
          instructions: VOICE_SYSTEM_PROMPT,
          voice: "shimmer",
          input_audio_format: "pcm16",
          output_audio_format: "pcm16",
          input_audio_transcription: { model: "whisper-1" },
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 600,
          },
          tools: [
            {
              type: "function",
              name: "finish_interview",
              description:
                "すべての情報が収集できてインタビューが完了したら呼び出す。reportTypeとbasicInfoを必ず含める。",
              parameters: {
                type: "object",
                properties: {
                  reportType: {
                    type: "string",
                    enum: ["trip", "seminar", "defect"],
                    description: "報告書タイプ（trip=出張, seminar=セミナー, defect=不良品）",
                  },
                  basicInfo: {
                    type: "object",
                    description: "収集した基本情報",
                    properties: {
                      reporterName: {
                        type: "string",
                        description: "報告者名",
                      },
                      date: {
                        type: "string",
                        description: "日程・期間",
                      },
                      destination: {
                        type: "string",
                        description: "出張先（出張の場合）",
                      },
                      seminarName: {
                        type: "string",
                        description: "セミナー名（セミナーの場合）",
                      },
                      productName: {
                        type: "string",
                        description: "製品名・工程名（不良品の場合）",
                      },
                      department: {
                        type: "string",
                        description: "部署名（任意）",
                      },
                    },
                  },
                },
                required: ["reportType", "basicInfo"],
              },
            },
          ],
          tool_choice: "auto",
          max_response_output_tokens: 1024,
        },
      });

      // Trigger initial greeting
      sendToOpenAI({
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [
            {
              type: "input_text",
              text: "こんにちは、報告書を作りたいです",
            },
          ],
        },
      });
      sendToOpenAI({ type: "response.create" });
    });

    openaiWs.on("message", async (data) => {
      try {
        const event = JSON.parse(data.toString());

        switch (event.type) {
          // ── Audio output ───────────────────────────────────────────
          case "response.audio.delta":
            sendToBrowser({ type: "audio", delta: event.delta });
            break;

          // ── AI transcript (streaming) ──────────────────────────────
          case "response.audio_transcript.delta":
            currentAssistantText += event.delta;
            sendToBrowser({
              type: "transcript_delta",
              role: "assistant",
              delta: event.delta,
            });
            break;

          // ── AI transcript (complete) ───────────────────────────────
          case "response.audio_transcript.done":
            transcript.push({
              role: "assistant",
              content: event.transcript || currentAssistantText,
            });
            currentAssistantText = "";
            sendToBrowser({
              type: "transcript_done",
              role: "assistant",
              text: event.transcript || "",
            });
            break;

          // ── User speech transcript ─────────────────────────────────
          case "conversation.item.input_audio_transcription.completed":
            transcript.push({ role: "user", content: event.transcript });
            sendToBrowser({
              type: "transcript_done",
              role: "user",
              text: event.transcript,
            });
            break;

          // ── Function call: finish_interview ────────────────────────
          case "response.function_call_arguments.done":
            if (event.name === "finish_interview") {
              console.log("[VoiceChat] finish_interview called");
              try {
                const args = JSON.parse(event.arguments);
                const reportType: "trip" | "seminar" | "defect" =
                  args.reportType || "trip";
                const basicInfo = args.basicInfo || {};

                sendToBrowser({ type: "generating_report" });

                const report = await generateReport(
                  transcript,
                  reportType,
                  basicInfo
                );

                sendToBrowser({
                  type: "report_complete",
                  report,
                  reportType,
                  basicInfo,
                });

                // Acknowledge function call to OpenAI
                sendToOpenAI({
                  type: "conversation.item.create",
                  item: {
                    type: "function_call_output",
                    call_id: event.call_id,
                    output: JSON.stringify({ success: true }),
                  },
                });
              } catch (err) {
                console.error("[VoiceChat] Report generation error:", err);
                sendToBrowser({
                  type: "error",
                  message: "報告書の生成に失敗しました。もう一度お試しください。",
                });
              }
            }
            break;

          // ── Status events ──────────────────────────────────────────
          case "input_audio_buffer.speech_started":
            sendToBrowser({ type: "status", event: "speech_started" });
            break;

          case "input_audio_buffer.speech_stopped":
            sendToBrowser({ type: "status", event: "speech_stopped" });
            break;

          case "response.created":
            sendToBrowser({ type: "status", event: "ai_speaking_start" });
            break;

          case "response.done":
            sendToBrowser({ type: "status", event: "ai_speaking_end" });
            break;

          case "session.created":
          case "session.updated":
            sendToBrowser({ type: "status", event: "ready" });
            break;

          case "error":
            console.error("[VoiceChat] OpenAI error:", event.error);
            sendToBrowser({
              type: "error",
              message: `AI接続エラー: ${event.error?.message || "不明なエラー"}`,
            });
            break;
        }
      } catch (e) {
        console.error("[VoiceChat] Message parse error:", e);
      }
    });

    openaiWs.on("error", (err) => {
      console.error("[VoiceChat] OpenAI WebSocket error:", err);
      sendToBrowser({
        type: "error",
        message: "AI接続エラーが発生しました。ページを再読み込みしてください。",
      });
    });

    openaiWs.on("close", () => {
      console.log("[VoiceChat] OpenAI WebSocket closed");
    });

    // ── Forward browser audio to OpenAI ────────────────────────────
    browserWs.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === "audio" && openaiWs.readyState === WebSocket.OPEN) {
          openaiWs.send(
            JSON.stringify({
              type: "input_audio_buffer.append",
              audio: message.audio,
            })
          );
        }
      } catch {
        // ignore
      }
    });

    browserWs.on("close", () => {
      console.log("[VoiceChat] Browser disconnected");
      if (openaiWs.readyState === WebSocket.OPEN) {
        openaiWs.close();
      }
    });

    browserWs.on("error", (err) => {
      console.error("[VoiceChat] Browser WebSocket error:", err);
    });
  });
}
