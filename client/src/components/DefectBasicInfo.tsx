import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ArrowRight, Upload } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

export function DefectBasicInfo() {
  const [, setLocation] = useLocation();
  const [discoveryDate, setDiscoveryDate] = useState<Date>();
  const [manufactureDate, setManufactureDate] = useState<Date>();
  const [formData, setFormData] = useState({
    reporterName: "",
    employeeId: "",
    department: "",
    discoveryLocation: "",
    productName: "",
    lotNumber: "",
    defectQuantity: "",
    discovererName: "",
    workerName: "",
    equipment: "",
    materialLot: "",
    customerName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const basicInfo = { 
      ...formData, 
      discoveryDate: discoveryDate ? discoveryDate.toLocaleDateString("ja-JP") : "",
      manufactureDate: manufactureDate ? manufactureDate.toLocaleDateString("ja-JP") : "",
      reportDate: new Date().toLocaleDateString("ja-JP")
    };
    console.log("Defect form submitted:", basicInfo);
    
    // Clear old chat history and report data before starting a new report
    localStorage.removeItem("defectChatHistory");
    localStorage.removeItem("defectReport");
    
    // Save to localStorage
    localStorage.setItem("defectBasicInfo", JSON.stringify(basicInfo));
    
    setLocation("/defect/character-selection");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-primary">ステップ 1/5</span>
          <span>基本情報入力</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>不良品報告書 - 基本情報入力</CardTitle>
            <CardDescription>不良品に関する基本的な情報を入力してください</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Reporter Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium border-b pb-2">報告者情報</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reporterName">報告者氏名 <span className="text-destructive">*</span></Label>
                    <Input
                      id="reporterName"
                      value={formData.reporterName}
                      onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                      placeholder="山田 太郎"
                      required
                      data-testid="input-reporter-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">社員ID <span className="text-destructive">*</span></Label>
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
                  <Label htmlFor="department">部署 <span className="text-destructive">*</span></Label>
                  <Select required>
                    <SelectTrigger data-testid="select-department">
                      <SelectValue placeholder="部署を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manufacturing">製造部</SelectItem>
                      <SelectItem value="quality">品質管理部</SelectItem>
                      <SelectItem value="inspection">検査部</SelectItem>
                      <SelectItem value="engineering">技術部</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Defect Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium border-b pb-2">不良情報</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>不良発見日時 <span className="text-destructive">*</span></Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !discoveryDate && "text-muted-foreground"
                          )}
                          data-testid="button-discovery-date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {discoveryDate ? format(discoveryDate, "PPP", { locale: ja }) : "日付を選択"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={discoveryDate} onSelect={setDiscoveryDate} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discoveryLocation">不良発見場所 <span className="text-destructive">*</span></Label>
                    <Input
                      id="discoveryLocation"
                      value={formData.discoveryLocation}
                      onChange={(e) => setFormData({ ...formData, discoveryLocation: e.target.value })}
                      placeholder="製造ライン A-1"
                      required
                      data-testid="input-discovery-location"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">製品名</Label>
                    <Input
                      id="productName"
                      value={formData.productName}
                      onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                      placeholder="型番：ABC-123"
                      data-testid="input-product-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lotNumber">ロット番号</Label>
                    <Input
                      id="lotNumber"
                      value={formData.lotNumber}
                      onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                      placeholder="LOT-2024-001"
                      data-testid="input-lot-number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="defectQuantity">不良数量 <span className="text-destructive">*</span></Label>
                    <Input
                      id="defectQuantity"
                      type="number"
                      value={formData.defectQuantity}
                      onChange={(e) => setFormData({ ...formData, defectQuantity: e.target.value })}
                      placeholder="10"
                      required
                      data-testid="input-defect-quantity"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discovererName">発見者氏名 <span className="text-destructive">*</span></Label>
                    <Input
                      id="discovererName"
                      value={formData.discovererName}
                      onChange={(e) => setFormData({ ...formData, discovererName: e.target.value })}
                      placeholder="佐藤 花子"
                      required
                      data-testid="input-discoverer-name"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium border-b pb-2">その他情報（任意）</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>製造日</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !manufactureDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {manufactureDate ? format(manufactureDate, "PPP", { locale: ja }) : "日付を選択"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={manufactureDate} onSelect={setManufactureDate} />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workerName">作業者氏名</Label>
                    <Input
                      id="workerName"
                      value={formData.workerName}
                      onChange={(e) => setFormData({ ...formData, workerName: e.target.value })}
                      placeholder="鈴木 一郎"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="equipment">使用設備</Label>
                  <Input
                    id="equipment"
                    value={formData.equipment}
                    onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                    placeholder="成形機 No.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerName">顧客名（出荷後不良の場合）</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="株式会社〇〇"
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium border-b pb-2">写真添付（任意）</h3>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate transition-all cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">不良現品の写真をアップロード（最大5枚）</p>
                  <p className="text-xs text-muted-foreground mt-1">クリックしてファイルを選択</p>
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
