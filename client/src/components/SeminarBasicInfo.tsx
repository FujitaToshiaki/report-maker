import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

export function SeminarBasicInfo() {
  const [, setLocation] = useLocation();
  const [seminarDate, setSeminarDate] = useState<Date>();
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    department: "",
    seminarName: "",
    organizer: "",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const basicInfo = { 
      ...formData, 
      seminarDate: seminarDate ? format(seminarDate, "yyyy年M月d日", { locale: ja }) : "" 
    };
    console.log("Form submitted:", basicInfo);
    
    // Clear old chat history and report data before starting a new report
    localStorage.removeItem("seminarChatHistory");
    localStorage.removeItem("seminarReport");
    
    // Save to localStorage
    localStorage.setItem("seminarBasicInfo", JSON.stringify(basicInfo));
    
    setLocation("/seminar/character-selection");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-primary">ステップ 1/5</span>
          <span>基本情報入力</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>セミナー参加報告 - 基本情報入力</CardTitle>
            <CardDescription>参加したセミナーに関する基本的な情報を入力してください</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">個人情報</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      氏名 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="山田 太郎"
                      required
                      data-testid="input-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">
                      社員ID <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="employeeId"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      placeholder="EMP001"
                      required
                      data-testid="input-employee-id"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">
                    部署名 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="営業部"
                    required
                    data-testid="input-department"
                  />
                </div>
              </div>

              {/* Seminar Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">セミナー詳細</h3>
                <div className="space-y-2">
                  <Label htmlFor="seminarName">
                    セミナー名 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="seminarName"
                    value={formData.seminarName}
                    onChange={(e) => setFormData({ ...formData, seminarName: e.target.value })}
                    placeholder="デジタルマーケティング基礎講座"
                    required
                    data-testid="input-seminar-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    開催日 <span className="text-destructive">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !seminarDate && "text-muted-foreground"
                        )}
                        data-testid="button-seminar-date"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {seminarDate ? format(seminarDate, "PPP", { locale: ja }) : "日付を選択"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={seminarDate} onSelect={setSeminarDate} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizer">
                    主催者 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="organizer"
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    placeholder="株式会社〇〇、〇〇協会"
                    required
                    data-testid="input-organizer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    開催場所 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="東京国際フォーラム、オンライン"
                    required
                    data-testid="input-location"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" data-testid="button-next">
                保存して次へ
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
