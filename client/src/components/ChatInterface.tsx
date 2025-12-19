import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Send, Save, SkipForward, X, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import masuoAvatar from "@assets/stock_images/friendly_smiling_jap_85bc98b0.jpg";
import ayaAvatar from "@assets/stock_images/cheerful_young_japan_b2b55419.jpg";
import kenjiAvatar from "@assets/stock_images/japanese_business_ma_5e330df8.jpg";
import masaruAvatar from "@assets/stock_images/japanese_quality_con_bc79927c.jpg";
import yumiAvatar from "@assets/stock_images/japanese_woman_quali_ddc78719.jpg";
import takashiAvatar from "@assets/stock_images/young_japanese_male__b682ba4c.jpg";
import takeshiAvatar from "@assets/stock_images/japanese_male_teache_13814af9.jpg";
import sayuriAvatar from "@assets/stock_images/professional_japanes_b2172ef2.jpg";
import kojiAvatar from "@assets/stock_images/young_japanese_man_n_b1abe3d7.jpg";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
}

interface ChatInterfaceProps {
  characterId: string;
  reportType: "trip" | "defect" | "seminar";
}

const characterData = {
  masuo: {
    name: "ますお兄さん",
    role: "ベテラン営業マン",
    avatar: masuoAvatar,
    initialMessage: "お疲れさまでした！今日の出張はどんな感じやったがけ？",
  },
  aya: {
    name: "あやちゃん",
    role: "若手企画職",
    avatar: ayaAvatar,
    initialMessage: "お疲れさまでした！出張どうやったがけ？楽しかった？",
  },
  kenji: {
    name: "けんじ部長",
    role: "管理職",
    avatar: kenjiAvatar,
    initialMessage: "お疲れさま。今回の出張、どうやったがけ？",
  },
  masaru: {
    name: "まさる課長",
    role: "品質管理ベテラン",
    avatar: masaruAvatar,
    initialMessage: "で、どんな不良やったがけ？詳しく教えてくれんけ。",
  },
  yumi: {
    name: "ゆみ主任",
    role: "現場リーダー",
    avatar: yumiAvatar,
    initialMessage: "不良が出たがけ？いつもと何が違っとったがけ？",
  },
  takashi: {
    name: "たかし技術者",
    role: "設備保全担当",
    avatar: takashiAvatar,
    initialMessage: "不良の報告やね。まず、どんな不良やったがけ？",
  },
  takeshi: {
    name: "たけし先生",
    role: "研修講師",
    avatar: takeshiAvatar,
    initialMessage: "セミナーお疲れさまでした！どんな内容やったがけ？",
  },
  sayuri: {
    name: "さゆり主任",
    role: "人事担当",
    avatar: sayuriAvatar,
    initialMessage: "セミナー参加お疲れさまでした！どんな学びがあったがけ？",
  },
  koji: {
    name: "こうじ君",
    role: "新入社員",
    avatar: kojiAvatar,
    initialMessage: "セミナー行ってきたがね！どんな感じやったがけ？",
  },
};

export function ChatInterface({ characterId, reportType }: ChatInterfaceProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const character = characterData[characterId as keyof typeof characterData] || characterData.masuo;
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Load purpose and set initial message
  useEffect(() => {
    let initialMessage = character.initialMessage;
    
    if (reportType === "trip") {
      const storedBasicInfo = localStorage.getItem("tripBasicInfo");
      if (storedBasicInfo) {
        const basicInfo = JSON.parse(storedBasicInfo);
        const purpose = basicInfo.purpose || "";
        
        if (purpose) {
          // Customize initial message with purpose
          if (characterId === "masuo") {
            initialMessage = `お疲れさまでした！「${purpose}」の出張やったがね。どんな感じやったがけ？`;
          } else if (characterId === "aya") {
            initialMessage = `お疲れさまでした！「${purpose}」の出張やったがね。どうやったがけ？`;
          } else if (characterId === "kenji") {
            initialMessage = `お疲れさま。「${purpose}」の出張、どうやったがけ？`;
          }
        }
      }
    }
    
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: initialMessage,
      },
    ]);
  }, [characterId, reportType, character.initialMessage]);
  
  // Calculate progress based on assistant message count (5 questions max)
  const assistantCount = messages.filter(m => m.role === 'assistant').length;
  const progress = Math.min((assistantCount / 5) * 100, 100);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      // Load purpose for trip reports
      let purpose = "";
      if (reportType === "trip") {
        const storedBasicInfo = localStorage.getItem("tripBasicInfo");
        if (storedBasicInfo) {
          const basicInfo = JSON.parse(storedBasicInfo);
          purpose = basicInfo.purpose || "";
        }
      }
      
      const response = await apiRequest("POST", "/api/chat", {
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        characterId,
        reportType,
        purpose,
      });
      return await response.json();
    },
    onSuccess: (data: any) => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.message,
      };
      setMessages((prev) => [...prev, aiMessage]);
    },
    onError: (error) => {
      console.error("Chat error:", error);
      toast({
        title: "エラー",
        description: "メッセージの送信に失敗しました。",
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages([...messages, userMessage]);
    setInput("");
    chatMutation.mutate(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSave = () => {
    console.log("Saving draft...");
    toast({
      title: "保存しました",
      description: "下書きを保存しました。",
    });
  };

  const handleSkip = () => {
    console.log("Skipping question...");
    // Progress is automatically calculated from message count
  };

  const handleEnd = () => {
    console.log("Ending interview...");
    
    // Save chat history to localStorage
    const chatHistory = messages.map((m) => ({ 
      role: m.role, 
      content: m.content 
    }));
    localStorage.setItem(`${reportType}ChatHistory`, JSON.stringify(chatHistory));
    
    const previewPath = reportType === "trip" ? "/trip/preview" : 
                        reportType === "seminar" ? "/seminar/preview" : 
                        "/defect/preview";
    setLocation(previewPath);
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={character.avatar} alt={character.name} />
                <AvatarFallback>{character.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{character.name}</h2>
                <p className="text-xs text-muted-foreground">{character.role}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleEnd} data-testid="button-close">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">進捗</span>
              <span className="font-medium">{assistantCount}/5 質問完了</span>
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
                  <AvatarImage src={character.avatar} alt={character.name} />
                  <AvatarFallback>{character.name[0]}</AvatarFallback>
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
          {chatMutation.isPending && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src={character.avatar} alt={character.name} />
                <AvatarFallback>{character.name[0]}</AvatarFallback>
              </Avatar>
              <div className="rounded-2xl px-4 py-3 bg-card text-card-foreground">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-base">考え中...</p>
                </div>
              </div>
            </div>
          )}
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
              disabled={chatMutation.isPending}
            />
            <Button 
              onClick={handleSend} 
              size="icon" 
              className="shrink-0" 
              data-testid="button-send"
              disabled={chatMutation.isPending || !input.trim()}
            >
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
