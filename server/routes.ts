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
        return res.status(400).json({ error: "Missing required fields" });
      }

      const response = await generateChatResponse({
        messages,
        characterId,
        reportType
      });

      res.json({ message: response });
    } catch (error) {
      console.error("Chat API error:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
