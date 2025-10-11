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

export function BasicInfoForm() {
  const [, setLocation] = useLocation();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    department: "",
    destination: "",
    company: "",
    companions: "",
    transportation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { ...formData, startDate, endDate });
    setLocation("/character-selection");
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
            <CardTitle>基本情報入力</CardTitle>
            <CardDescription>出張に関する基本的な情報を入力してください</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">個人情報</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      出張者氏名 <span className="text-destructive">*</span>
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

              {/* Trip Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">出張詳細</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      出張開始日 <span className="text-destructive">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                          data-testid="button-start-date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP", { locale: ja }) : "日付を選択"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>
                      出張終了日 <span className="text-destructive">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                          data-testid="button-end-date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP", { locale: ja }) : "日付を選択"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">
                    出張先（都道府県・市区町村）<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="東京都千代田区"
                    required
                    data-testid="input-destination"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">
                    訪問先企業名 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="株式会社〇〇"
                    required
                    data-testid="input-company"
                  />
                </div>
              </div>

              {/* Optional Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">その他情報（任意）</h3>
                <div className="space-y-2">
                  <Label htmlFor="companions">同行者</Label>
                  <Input
                    id="companions"
                    value={formData.companions}
                    onChange={(e) => setFormData({ ...formData, companions: e.target.value })}
                    placeholder="佐藤 花子"
                    data-testid="input-companions"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transportation">交通手段</Label>
                  <Input
                    id="transportation"
                    value={formData.transportation}
                    onChange={(e) => setFormData({ ...formData, transportation: e.target.value })}
                    placeholder="新幹線"
                    data-testid="input-transportation"
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
