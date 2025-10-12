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

interface TripReport {
  purpose: string;
  activities: string[];
  achievements: string[];
  issues: { issue: string; cause: string }[];
  actions: { action: string; deadline: string; person: string }[];
  impression: string;
}

export function ReportPreview() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [report, setReport] = useState<TripReport | null>(null);
  const [basicInfo, setBasicInfo] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedReport, setEditedReport] = useState<TripReport | null>(null);
  const [editedBasicInfo, setEditedBasicInfo] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const generateMutation = useMutation({
    mutationFn: async ({ messages, basicInfo }: { messages: any[]; basicInfo: any }) => {
      const response = await apiRequest("POST", "/api/generate-report", {
        messages,
        reportType: "trip",
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
    const storedBasicInfo = localStorage.getItem("tripBasicInfo");
    const storedChatHistory = localStorage.getItem("tripChatHistory");

    if (!storedBasicInfo || !storedChatHistory) {
      toast({
        title: "エラー",
        description: "必要な情報が見つかりません。最初からやり直してください。",
        variant: "destructive",
      });
      setLocation("/trip/basic-info");
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
    setEditedReport(JSON.parse(JSON.stringify(report)));
    setEditedBasicInfo(JSON.parse(JSON.stringify(basicInfo)));
    setIsEditMode(true);
  };

  const handleSave = () => {
    if (!editedReport || !editedBasicInfo) return;
    
    setReport(editedReport);
    setBasicInfo(editedBasicInfo);
    
    // Update localStorage
    localStorage.setItem("tripBasicInfo", JSON.stringify(editedBasicInfo));
    
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

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      // If content fits in one page, add it directly
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        // Split content into multiple pages
        let heightLeft = imgHeight;
        let position = 0;
        
        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add remaining pages
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }
      
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `出張報告書_${basicInfo.name}_${timestamp}.pdf`;
      
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
    localStorage.removeItem("tripBasicInfo");
    localStorage.removeItem("tripChatHistory");
    localStorage.removeItem("tripCharacter");
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
            <CardTitle className="text-2xl">出張報告書</CardTitle>
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
                        value={editedBasicInfo.name}
                        onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, name: e.target.value })}
                        data-testid="input-edit-name"
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
                    <label className="text-sm font-medium">社員ID</label>
                    <Input
                      value={editedBasicInfo.employeeId}
                      onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, employeeId: e.target.value })}
                      data-testid="input-edit-employee-id"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">出張開始日</label>
                      <Input
                        type="date"
                        value={editedBasicInfo.startDate}
                        onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, startDate: e.target.value })}
                        data-testid="input-edit-start-date"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">出張終了日</label>
                      <Input
                        type="date"
                        value={editedBasicInfo.endDate}
                        onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, endDate: e.target.value })}
                        data-testid="input-edit-end-date"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium">出張先</label>
                      <Input
                        value={editedBasicInfo.destination}
                        onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, destination: e.target.value })}
                        data-testid="input-edit-destination"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">会社名</label>
                      <Input
                        value={editedBasicInfo.company || ''}
                        onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, company: e.target.value })}
                        data-testid="input-edit-company"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">同行者（任意）</label>
                    <Input
                      value={editedBasicInfo.companions || ''}
                      onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, companions: e.target.value })}
                      data-testid="input-edit-companions"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">報告者：</span>
                    {basicInfo.name}（{basicInfo.department}）
                  </p>
                  <p>
                    <span className="font-medium">社員ID：</span>
                    <span className="font-mono">{basicInfo.employeeId}</span>
                  </p>
                  <p>
                    <span className="font-medium">出張期間：</span>
                    {basicInfo.startDate} 〜 {basicInfo.endDate}
                  </p>
                  <p>
                    <span className="font-medium">出張先：</span>
                    {basicInfo.destination} {basicInfo.company}
                  </p>
                  {basicInfo.companions && (
                    <p>
                      <span className="font-medium">同行者：</span>
                      {basicInfo.companions}
                    </p>
                  )}
                </div>
              )}
            </section>

            <Separator />

            {/* Purpose */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【出張目的】</h3>
              <p className="text-sm leading-relaxed">{report.purpose}</p>
            </section>

            <Separator />

            {/* Activities */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【活動内容】</h3>
              <ul className="space-y-1">
                {report.activities.map((activity, idx) => (
                  <li key={idx} className="text-sm flex">
                    <span className="mr-2">•</span>
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </section>

            <Separator />

            {/* Achievements */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【成果・収穫】</h3>
              <ol className="space-y-1">
                {report.achievements.map((achievement, idx) => (
                  <li key={idx} className="text-sm flex">
                    <span className="mr-2">{idx + 1}.</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ol>
            </section>

            <Separator />

            {/* Issues */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【課題・問題点】</h3>
              {report.issues.map((item, idx) => (
                <div key={idx} className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">■ 課題：</span>
                    {item.issue}
                  </p>
                  <p className="ml-4">
                    <span className="font-medium">原因：</span>
                    {item.cause}
                  </p>
                </div>
              ))}
            </section>

            <Separator />

            {/* Actions */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【今後のアクション】</h3>
              <div className="space-y-2">
                {report.actions.map((action, idx) => (
                  <div key={idx} className="text-sm flex">
                    <span className="mr-2">□</span>
                    <span>
                      {action.action}（期限：{action.deadline}、担当：{action.person}）
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Impression */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【所感】</h3>
              <p className="text-sm leading-relaxed">{report.impression}</p>
            </section>

            <div className="pt-4 text-center text-sm text-muted-foreground">以上</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
