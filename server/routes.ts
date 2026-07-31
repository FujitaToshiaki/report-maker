import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from "ws";
import { storage } from "./storage";
import { generateChatResponse } from "./chat";
import { generateReport } from "./report-generator";
import { setupVoiceChat } from "./voice-chat";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat API endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, characterId, reportType } = req.body;

      if (!messages || !characterId) {
        return res.status(400).json({ error: "必須フィールドが不足しています" });
      }

      const response = await generateChatResponse({
        messages,
        characterId,
        reportType
      });

      res.json({ message: response });
    } catch (error) {
      console.error("Chat API error:", error);
      
      // Extract user-friendly error message if available
      if (error instanceof Error) {
        // Return specific error messages from the chat service
        if (error.message.includes("トークン制限") || error.message.includes("AIからの応答")) {
          return res.status(400).json({ error: error.message });
        }
      }
      
      res.status(500).json({ error: "応答の生成に失敗しました。もう一度お試しください。" });
    }
  });

  // Report generation API endpoint
  app.post("/api/generate-report", async (req, res) => {
    try {
      const { messages, reportType, basicInfo } = req.body;

      if (!messages || !reportType || !basicInfo) {
        return res.status(400).json({ error: "必須フィールドが不足しています" });
      }

      const report = await generateReport(messages, reportType, basicInfo);

      res.json({ report });
    } catch (error) {
      console.error("Report generation error:", error);
      
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: "報告書の生成に失敗しました。もう一度お試しください。" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for voice chat (path: /ws/voice-chat)
  const wss = new WebSocketServer({ noServer: true });
  setupVoiceChat(wss);

  httpServer.on("upgrade", (request, socket, head) => {
    if (request.url === "/ws/voice-chat") {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  return httpServer;
}
