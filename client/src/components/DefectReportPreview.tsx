import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit2, Download, Send, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DefectReport {
  defectDescription: string;
  fourM: {
    man: string;
    machine: string;
    material: string;
    method: string;
  };
  fiveWhy: {
    why1: string;
    why2: string;
    why3: string;
    why4: string;
    why5: string;
  };
  immediateAction: string;
  permanentAction: string;
  horizontalDeployment: string;
  effectConfirmation: string;
}

export function DefectReportPreview() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [report, setReport] = useState<DefectReport | null>(null);
  const [basicInfo, setBasicInfo] = useState<any>(null);

  const generateMutation = useMutation({
    mutationFn: async ({ messages, basicInfo }: { messages: any[]; basicInfo: any }) => {
      const response = await apiRequest("POST", "/api/generate-report", {
        messages,
        reportType: "defect",
        basicInfo,
      });
      return await response.json();
    },
    onSuccess: (data: any) => {
      setReport(data.report);
    },
    onError: (error) => {
      console.error("Report generation error:", error);
      toast({
        title: "エラー",
        description: "報告書の生成に失敗しました。",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    // Load basic info and chat history from localStorage
    const storedBasicInfo = localStorage.getItem("defectBasicInfo");
    const storedChatHistory = localStorage.getItem("defectChatHistory");

    if (!storedBasicInfo || !storedChatHistory) {
      toast({
        title: "エラー",
        description: "必要な情報が見つかりません。最初からやり直してください。",
        variant: "destructive",
      });
      setLocation("/defect/basic-info");
      return;
    }

    const parsedBasicInfo = JSON.parse(storedBasicInfo);
    const parsedChatHistory = JSON.parse(storedChatHistory);

    setBasicInfo(parsedBasicInfo);
    generateMutation.mutate({
      messages: parsedChatHistory,
      basicInfo: parsedBasicInfo,
    });
  }, []);

  const handleEdit = () => {
    console.log("Edit report");
    // In real app, navigate to edit mode
  };

  const handleDownload = () => {
    console.log("Download PDF");
    // In real app, generate and download PDF
  };

  const handleSubmit = () => {
    console.log("Submit report");
    // Clear localStorage
    localStorage.removeItem("defectBasicInfo");
    localStorage.removeItem("defectChatHistory");
    localStorage.removeItem("defectCharacter");
    setLocation("/");
  };

  if (generateMutation.isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-lg text-muted-foreground">AIが報告書を生成しています...</p>
        </div>
      </div>
    );
  }

  if (!report || !basicInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-primary">ステップ 4/4</span>
          <span>報告書プレビュー</span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleEdit} data-testid="button-edit">
            <Edit2 className="mr-2 h-4 w-4" />
            編集
          </Button>
          <Button variant="outline" onClick={handleDownload} data-testid="button-download">
            <Download className="mr-2 h-4 w-4" />
            PDF出力
          </Button>
          <Button className="ml-auto" onClick={handleSubmit} data-testid="button-submit">
            <Send className="mr-2 h-4 w-4" />
            提出
          </Button>
        </div>

        {/* Report */}
        <Card>
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl">不良品報告書</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【基本情報】</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">報告者：</span>
                  {basicInfo.reporterName}（{basicInfo.department}）
                </p>
                <p>
                  <span className="font-medium">報告日：</span>
                  {basicInfo.reportDate || new Date().toLocaleDateString("ja-JP")}
                </p>
                {basicInfo.productName && (
                  <p>
                    <span className="font-medium">製品名：</span>
                    {basicInfo.productName}
                  </p>
                )}
                {basicInfo.lotNumber && (
                  <p>
                    <span className="font-medium">ロット番号：</span>
                    {basicInfo.lotNumber}
                  </p>
                )}
                {basicInfo.defectQuantity && (
                  <p>
                    <span className="font-medium">不良数量：</span>
                    {basicInfo.defectQuantity}
                  </p>
                )}
              </div>
            </section>

            <Separator />

            {/* Defect Description */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【不良内容】</h3>
              <p className="text-sm leading-relaxed">{report.defectDescription}</p>
            </section>

            <Separator />

            {/* 4M Analysis */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【4M分析】</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">■ Man（作業者）：</span>
                  <p className="ml-4">{report.fourM.man}</p>
                </div>
                <div>
                  <span className="font-medium">■ Machine（設備）：</span>
                  <p className="ml-4">{report.fourM.machine}</p>
                </div>
                <div>
                  <span className="font-medium">■ Material（材料）：</span>
                  <p className="ml-4">{report.fourM.material}</p>
                </div>
                <div>
                  <span className="font-medium">■ Method（方法）：</span>
                  <p className="ml-4">{report.fourM.method}</p>
                </div>
              </div>
            </section>

            <Separator />

            {/* 5Why Analysis */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【5Why分析】</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Why 1：</span>
                  <p className="ml-4">{report.fiveWhy.why1}</p>
                </div>
                <div>
                  <span className="font-medium">Why 2：</span>
                  <p className="ml-4">{report.fiveWhy.why2}</p>
                </div>
                <div>
                  <span className="font-medium">Why 3：</span>
                  <p className="ml-4">{report.fiveWhy.why3}</p>
                </div>
                <div>
                  <span className="font-medium">Why 4：</span>
                  <p className="ml-4">{report.fiveWhy.why4}</p>
                </div>
                <div>
                  <span className="font-medium">Why 5（真因）：</span>
                  <p className="ml-4 font-semibold text-destructive">{report.fiveWhy.why5}</p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Immediate Action */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【応急処置】</h3>
              <p className="text-sm leading-relaxed">{report.immediateAction}</p>
            </section>

            <Separator />

            {/* Permanent Action */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【恒久対策】</h3>
              <p className="text-sm leading-relaxed">{report.permanentAction}</p>
            </section>

            <Separator />

            {/* Horizontal Deployment */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【水平展開】</h3>
              <p className="text-sm leading-relaxed">{report.horizontalDeployment}</p>
            </section>

            <Separator />

            {/* Effect Confirmation */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【効果確認】</h3>
              <p className="text-sm leading-relaxed">{report.effectConfirmation}</p>
            </section>

            <div className="pt-4 text-center text-sm text-muted-foreground">以上</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
