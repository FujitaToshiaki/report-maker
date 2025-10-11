import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateChatResponse } from "./chat";

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

  const httpServer = createServer(app);

  return httpServer;
}
