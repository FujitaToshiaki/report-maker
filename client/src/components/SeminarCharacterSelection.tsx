import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import takeshiAvatar from "@assets/stock_images/mature_japanese_trai_00e627f8.jpg";
import sayuriAvatar from "@assets/stock_images/japanese_woman_in_he_1bb5ca4e.jpg";
import kojiAvatar from "@assets/stock_images/young_japanese_man_f_a4b73fdf.jpg";

const characters = [
  {
    id: "takeshi",
    name: "たけし先生",
    role: "40代研修講師",
    avatar: takeshiAvatar,
    description: "教育的で知識豊富な丁寧なインタビュアー",
    sample: "「それは大事な学びながいぜ」",
    color: "border-blue-500",
  },
  {
    id: "sayuri",
    name: "さゆり主任",
    role: "30代人事担当",
    avatar: sayuriAvatar,
    description: "優しく励ます学びを大切にする相談役",
    sample: "「それってどう活かせそうながけ？」",
    color: "border-purple-400",
  },
  {
    id: "koji",
    name: "こうじ君",
    role: "20代新入社員",
    avatar: kojiAvatar,
    description: "フレッシュで好奇心旺盛な共感役",
    sample: "「僕も勉強になるがいぜ！」",
    color: "border-green-500",
  },
];

export function SeminarCharacterSelection() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelected(id);
    console.log("Character selected:", id);
  };

  const handleStart = () => {
    if (selected) {
      console.log("Starting interview with:", selected);
      setLocation(`/seminar/chat?character=${selected}&type=seminar`);
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
            富山弁で話すキャラクターを選んでください。対話を通じてセミナーの学びを整理します。
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
