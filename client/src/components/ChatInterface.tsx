import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Send, Save, SkipForward, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import masuoAvatar from "@assets/stock_images/friendly_mature_japa_e8e63f4f.jpg";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
}

// Mock initial messages - todo: remove mock functionality
const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "お疲れさまでした！今日の出張はどんな感じやったがけ？",
  },
];

export function ChatInterface() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [progress, setProgress] = useState(7); // 1/15 questions
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages([...messages, userMessage]);
    setInput("");

    // Simulate AI response - todo: replace with actual AI integration
    setTimeout(() => {
      const responses = [
        "なるほどのう！それで、一番印象に残ったことは何ながけ？",
        "そうやったがけ。もうちょっと詳しく教えてくれんけ？",
        "ほうほう、そんがんこつがあったがか。で、当初の目的は達成できたがけ？",
      ];
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
      };
      setMessages((prev) => [...prev, aiMessage]);
      setProgress((prev) => Math.min(prev + 7, 100));
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSave = () => {
    console.log("Saving draft...");
  };

  const handleSkip = () => {
    console.log("Skipping question...");
    setProgress((prev) => Math.min(prev + 7, 100));
  };

  const handleEnd = () => {
    console.log("Ending interview...");
    setLocation("/trip/preview");
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={masuoAvatar} alt="ますお兄さん" />
                <AvatarFallback>ま</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">ますお兄さん</h2>
                <p className="text-xs text-muted-foreground">ベテラン営業マン</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleEnd} data-testid="button-close">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">進捗</span>
              <span className="font-medium">{Math.round(progress / 7)}/15 質問完了</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={masuoAvatar} alt="ますお兄さん" />
                  <AvatarFallback>ま</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 max-w-[80%]",
                  message.role === "assistant"
                    ? "bg-card text-card-foreground"
                    : "bg-primary text-primary-foreground"
                )}
                data-testid={`message-${message.role}`}
              >
                <p className="text-base leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t p-4 bg-background">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="メッセージを入力..."
              className="resize-none"
              rows={2}
              data-testid="input-message"
            />
            <Button onClick={handleSend} size="icon" className="shrink-0" data-testid="button-send">
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleSave} data-testid="button-save">
              <Save className="mr-2 h-4 w-4" />
              一時保存
            </Button>
            <Button variant="outline" size="sm" onClick={handleSkip} data-testid="button-skip">
              <SkipForward className="mr-2 h-4 w-4" />
              スキップ
            </Button>
            <Button variant="outline" size="sm" onClick={handleEnd} data-testid="button-finish">
              インタビュー終了
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
