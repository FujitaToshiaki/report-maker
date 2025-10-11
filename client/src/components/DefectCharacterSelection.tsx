import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import masuoAvatar from "@assets/stock_images/friendly_mature_japa_e8e63f4f.jpg";
import yumiAvatar from "@assets/stock_images/young_japanese_woman_c4b45ecb.jpg";
import takashiAvatar from "@assets/stock_images/japanese_business_ma_e2c8ac52.jpg";

const characters = [
  {
    id: "masaru",
    name: "まさる課長",
    role: "50代品質管理ベテラン",
    avatar: masuoAvatar,
    description: "冷静沈着な分析者、5Why分析の誘導役",
    sample: "「で、どんな不良やったがけ？」",
    color: "border-primary",
  },
  {
    id: "yumi",
    name: "ゆみ主任",
    role: "30代現場リーダー",
    avatar: yumiAvatar,
    description: "現場感覚が鋭い実務的な確認役",
    sample: "「いつもと何が違っとったがけ？」",
    color: "border-chart-2",
  },
  {
    id: "takashi",
    name: "たかし技術者",
    role: "40代設備保全担当",
    avatar: takashiAvatar,
    description: "技術的・データ重視の深掘り役",
    sample: "「設備の調子はどうやった？」",
    color: "border-chart-3",
  },
];

export function DefectCharacterSelection() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelected(id);
    console.log("Character selected:", id);
  };

  const handleStart = () => {
    if (selected) {
      console.log("Starting defect analysis with:", selected);
      setLocation("/defect/chat");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-primary">ステップ 2/5</span>
          <span>分析担当者選択</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold">分析担当者を選択</h1>
          <p className="text-muted-foreground">
            富山弁で話すキャラクターを選んでください。5Why分析を通じて根本原因を特定します。
          </p>
        </div>

        {/* Character Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {characters.map((character) => (
            <Card
              key={character.id}
              className={cn(
                "hover-elevate transition-all cursor-pointer relative",
                selected === character.id && `border-2 ${character.color}`
              )}
              onClick={() => handleSelect(character.id)}
              data-testid={`card-character-${character.id}`}
            >
              {selected === character.id && (
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              )}
              <CardHeader className="text-center space-y-4">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src={character.avatar} alt={character.name} />
                  <AvatarFallback>{character.name[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="text-xl">{character.name}</CardTitle>
                  <CardDescription>{character.role}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-center">{character.description}</p>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm text-center font-medium">{character.sample}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleStart}
            disabled={!selected}
            data-testid="button-start-analysis"
          >
            分析を始める
          </Button>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
