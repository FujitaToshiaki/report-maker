import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import masuoAvatar from "@assets/stock_images/friendly_mature_japa_e8e63f4f.jpg";
import ayaAvatar from "@assets/stock_images/young_japanese_woman_c4b45ecb.jpg";
import kenjiAvatar from "@assets/stock_images/japanese_business_ma_e2c8ac52.jpg";

const characters = [
  {
    id: "masuo",
    name: "ますお兄さん",
    role: "50代ベテラン営業マン",
    avatar: masuoAvatar,
    description: "温厚で聞き上手な経験豊富なインタビュアー",
    sample: "「そんがんこつはどうやったがけ？」",
    color: "border-chart-3",
  },
  {
    id: "aya",
    name: "あやちゃん",
    role: "20代若手企画職",
    avatar: ayaAvatar,
    description: "明るく好奇心旺盛な掘り下げ役",
    sample: "「それってどういうことながけ？」",
    color: "border-pink-400",
  },
  {
    id: "kenji",
    name: "けんじ部長",
    role: "40代管理職",
    avatar: kenjiAvatar,
    description: "要点を押さえる実務的な確認役",
    sample: "「そこは大事ながいぜ」",
    color: "border-primary",
  },
];

export function CharacterSelection() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelected(id);
    console.log("Character selected:", id);
  };

  const handleStart = () => {
    if (selected) {
      console.log("Starting interview with:", selected);
      setLocation("/chat");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-primary">ステップ 2/5</span>
          <span>インタビュアー選択</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold">インタビュアーを選択</h1>
          <p className="text-muted-foreground">
            富山弁で話すキャラクターを選んでください。対話を通じて報告書を作成します。
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
            data-testid="button-start-interview"
          >
            インタビューを始める
          </Button>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
