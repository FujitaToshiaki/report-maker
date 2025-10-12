import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Download, Send, Loader2, Save, X } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedReport, setEditedReport] = useState<DefectReport | null>(null);
  const [editedBasicInfo, setEditedBasicInfo] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);

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
    const storedReport = localStorage.getItem("defectReport");

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
    setBasicInfo(parsedBasicInfo);

    // If there's a saved report, use it instead of generating a new one
    if (storedReport) {
      const parsedReport = JSON.parse(storedReport);
      setReport(parsedReport);
    } else {
      // Generate new report from chat history
      const parsedChatHistory = JSON.parse(storedChatHistory);
      generateMutation.mutate({
        messages: parsedChatHistory,
        basicInfo: parsedBasicInfo,
      });
    }
  }, []);

  const handleEdit = () => {
    setEditedReport(JSON.parse(JSON.stringify(report)));
    setEditedBasicInfo(JSON.parse(JSON.stringify(basicInfo)));
    setIsEditMode(true);
  };

  const handleSave = () => {
    if (!editedReport || !editedBasicInfo) return;
    
    setReport(editedReport);
    setBasicInfo(editedBasicInfo);
    
    localStorage.setItem("defectBasicInfo", JSON.stringify(editedBasicInfo));
    localStorage.setItem("defectReport", JSON.stringify(editedReport));
    
    setIsEditMode(false);
    
    toast({
      title: "保存完了",
      description: "報告書を更新しました。",
    });
  };

  const handleCancel = () => {
    setEditedReport(null);
    setEditedBasicInfo(null);
    setIsEditMode(false);
  };

  const handleDownload = async () => {
    if (!reportRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }
      
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `不良品報告書_${basicInfo.reporterName}_${timestamp}.pdf`;
      
      pdf.save(filename);
      
      toast({
        title: "PDF出力完了",
        description: "報告書をPDF形式でダウンロードしました。",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "エラー",
        description: "PDF出力に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
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
          {isEditMode ? (
            <>
              <Button variant="default" onClick={handleSave} data-testid="button-save">
                <Save className="mr-2 h-4 w-4" />
                保存
              </Button>
              <Button variant="outline" onClick={handleCancel} data-testid="button-cancel">
                <X className="mr-2 h-4 w-4" />
                キャンセル
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleEdit} data-testid="button-edit">
                <Edit2 className="mr-2 h-4 w-4" />
                編集
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDownload} 
                disabled={isDownloading}
                data-testid="button-download"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    PDF生成中...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    PDF出力
                  </>
                )}
              </Button>
              <Button className="ml-auto" onClick={handleSubmit} data-testid="button-submit">
                <Send className="mr-2 h-4 w-4" />
                提出
              </Button>
            </>
          )}
        </div>

        {/* Report */}
        <Card ref={reportRef}>
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl">不良品報告書</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【基本情報】</h3>
              {isEditMode && editedBasicInfo ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">報告者</label>
                      <Input
                        value={editedBasicInfo.reporterName}
                        onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, reporterName: e.target.value })}
                        data-testid="input-edit-reporter-name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">部署</label>
                      <Input
                        value={editedBasicInfo.department}
                        onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, department: e.target.value })}
                        data-testid="input-edit-department"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">製品名</label>
                    <Input
                      value={editedBasicInfo.productName || ''}
                      onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, productName: e.target.value })}
                      data-testid="input-edit-product-name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">ロット番号</label>
                      <Input
                        value={editedBasicInfo.lotNumber || ''}
                        onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, lotNumber: e.target.value })}
                        data-testid="input-edit-lot-number"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">不良数量</label>
                      <Input
                        value={editedBasicInfo.defectQuantity || ''}
                        onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, defectQuantity: e.target.value })}
                        data-testid="input-edit-defect-quantity"
                      />
                    </div>
                  </div>
                </div>
              ) : (
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
              )}
            </section>

            <Separator />

            {/* Defect Description */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【不良内容】</h3>
              {isEditMode && editedReport ? (
                <Textarea
                  value={editedReport.defectDescription}
                  onChange={(e) => setEditedReport({ ...editedReport, defectDescription: e.target.value })}
                  rows={3}
                  data-testid="textarea-edit-defect-description"
                />
              ) : (
                <p className="text-sm leading-relaxed">{report.defectDescription}</p>
              )}
            </section>

            <Separator />

            {/* 4M Analysis */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【4M分析】</h3>
              {isEditMode && editedReport ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">■ Man（作業者）</label>
                    <Textarea
                      value={editedReport.fourM.man}
                      onChange={(e) => setEditedReport({ ...editedReport, fourM: { ...editedReport.fourM, man: e.target.value } })}
                      rows={2}
                      data-testid="textarea-edit-4m-man"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">■ Machine（設備）</label>
                    <Textarea
                      value={editedReport.fourM.machine}
                      onChange={(e) => setEditedReport({ ...editedReport, fourM: { ...editedReport.fourM, machine: e.target.value } })}
                      rows={2}
                      data-testid="textarea-edit-4m-machine"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">■ Material（材料）</label>
                    <Textarea
                      value={editedReport.fourM.material}
                      onChange={(e) => setEditedReport({ ...editedReport, fourM: { ...editedReport.fourM, material: e.target.value } })}
                      rows={2}
                      data-testid="textarea-edit-4m-material"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">■ Method（方法）</label>
                    <Textarea
                      value={editedReport.fourM.method}
                      onChange={(e) => setEditedReport({ ...editedReport, fourM: { ...editedReport.fourM, method: e.target.value } })}
                      rows={2}
                      data-testid="textarea-edit-4m-method"
                    />
                  </div>
                </div>
              ) : (
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
              )}
            </section>

            <Separator />

            {/* 5Why Analysis */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【5Why分析】</h3>
              {isEditMode && editedReport ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Why 1</label>
                    <Textarea
                      value={editedReport.fiveWhy.why1}
                      onChange={(e) => setEditedReport({ ...editedReport, fiveWhy: { ...editedReport.fiveWhy, why1: e.target.value } })}
                      rows={2}
                      data-testid="textarea-edit-why1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Why 2</label>
                    <Textarea
                      value={editedReport.fiveWhy.why2}
                      onChange={(e) => setEditedReport({ ...editedReport, fiveWhy: { ...editedReport.fiveWhy, why2: e.target.value } })}
                      rows={2}
                      data-testid="textarea-edit-why2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Why 3</label>
                    <Textarea
                      value={editedReport.fiveWhy.why3}
                      onChange={(e) => setEditedReport({ ...editedReport, fiveWhy: { ...editedReport.fiveWhy, why3: e.target.value } })}
                      rows={2}
                      data-testid="textarea-edit-why3"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Why 4</label>
                    <Textarea
                      value={editedReport.fiveWhy.why4}
                      onChange={(e) => setEditedReport({ ...editedReport, fiveWhy: { ...editedReport.fiveWhy, why4: e.target.value } })}
                      rows={2}
                      data-testid="textarea-edit-why4"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Why 5（真因）</label>
                    <Textarea
                      value={editedReport.fiveWhy.why5}
                      onChange={(e) => setEditedReport({ ...editedReport, fiveWhy: { ...editedReport.fiveWhy, why5: e.target.value } })}
                      rows={2}
                      className="font-semibold"
                      data-testid="textarea-edit-why5"
                    />
                  </div>
                </div>
              ) : (
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
              )}
            </section>

            <Separator />

            {/* Immediate Action */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【応急処置】</h3>
              {isEditMode && editedReport ? (
                <Textarea
                  value={editedReport.immediateAction}
                  onChange={(e) => setEditedReport({ ...editedReport, immediateAction: e.target.value })}
                  rows={3}
                  data-testid="textarea-edit-immediate-action"
                />
              ) : (
                <p className="text-sm leading-relaxed">{report.immediateAction}</p>
              )}
            </section>

            <Separator />

            {/* Permanent Action */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【恒久対策】</h3>
              {isEditMode && editedReport ? (
                <Textarea
                  value={editedReport.permanentAction}
                  onChange={(e) => setEditedReport({ ...editedReport, permanentAction: e.target.value })}
                  rows={3}
                  data-testid="textarea-edit-permanent-action"
                />
              ) : (
                <p className="text-sm leading-relaxed">{report.permanentAction}</p>
              )}
            </section>

            <Separator />

            {/* Horizontal Deployment */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【水平展開】</h3>
              {isEditMode && editedReport ? (
                <Textarea
                  value={editedReport.horizontalDeployment}
                  onChange={(e) => setEditedReport({ ...editedReport, horizontalDeployment: e.target.value })}
                  rows={3}
                  data-testid="textarea-edit-horizontal-deployment"
                />
              ) : (
                <p className="text-sm leading-relaxed">{report.horizontalDeployment}</p>
              )}
            </section>

            <Separator />

            {/* Effect Confirmation */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【効果確認】</h3>
              {isEditMode && editedReport ? (
                <Textarea
                  value={editedReport.effectConfirmation}
                  onChange={(e) => setEditedReport({ ...editedReport, effectConfirmation: e.target.value })}
                  rows={3}
                  data-testid="textarea-edit-effect-confirmation"
                />
              ) : (
                <p className="text-sm leading-relaxed">{report.effectConfirmation}</p>
              )}
            </section>

            <div className="pt-4 text-center text-sm text-muted-foreground">以上</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
