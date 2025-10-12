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

interface SeminarReport {
  summary: string;
  learnings: string[];
  insights: string[];
  applications: string[];
}

export function SeminarReportPreview() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [report, setReport] = useState<SeminarReport | null>(null);
  const [basicInfo, setBasicInfo] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedReport, setEditedReport] = useState<SeminarReport | null>(null);
  const [editedBasicInfo, setEditedBasicInfo] = useState<any>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const generateMutation = useMutation({
    mutationFn: async ({ messages, basicInfo }: { messages: any[]; basicInfo: any }) => {
      const response = await apiRequest("POST", "/api/generate-report", {
        messages,
        reportType: "seminar",
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
    const storedBasicInfo = localStorage.getItem("seminarBasicInfo");
    const storedChatHistory = localStorage.getItem("seminarChatHistory");
    const storedReport = localStorage.getItem("seminarReport");

    if (!storedBasicInfo || !storedChatHistory) {
      toast({
        title: "エラー",
        description: "必要な情報が見つかりません。最初からやり直してください。",
        variant: "destructive",
      });
      setLocation("/seminar/basic-info");
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
    
    localStorage.setItem("seminarBasicInfo", JSON.stringify(editedBasicInfo));
    localStorage.setItem("seminarReport", JSON.stringify(editedReport));
    
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
      const filename = `セミナー参加報告書_${basicInfo.name}_${timestamp}.pdf`;
      
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
    localStorage.removeItem("seminarBasicInfo");
    localStorage.removeItem("seminarChatHistory");
    localStorage.removeItem("seminarCharacter");
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
            <CardTitle className="text-2xl">セミナー参加報告書</CardTitle>
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
                  <div>
                    <label className="text-sm font-medium">セミナー名</label>
                    <Input
                      value={editedBasicInfo.seminarName}
                      onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, seminarName: e.target.value })}
                      data-testid="input-edit-seminar-name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">開催日</label>
                    <Input
                      value={editedBasicInfo.seminarDate}
                      onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, seminarDate: e.target.value })}
                      data-testid="input-edit-seminar-date"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">主催者</label>
                    <Input
                      value={editedBasicInfo.organizer}
                      onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, organizer: e.target.value })}
                      data-testid="input-edit-organizer"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">開催場所</label>
                    <Input
                      value={editedBasicInfo.location}
                      onChange={(e) => setEditedBasicInfo({ ...editedBasicInfo, location: e.target.value })}
                      data-testid="input-edit-location"
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
                    <span className="font-medium">セミナー名：</span>
                    {basicInfo.seminarName}
                  </p>
                  <p>
                    <span className="font-medium">開催日：</span>
                    {basicInfo.seminarDate}
                  </p>
                  <p>
                    <span className="font-medium">主催者：</span>
                    {basicInfo.organizer}
                  </p>
                  <p>
                    <span className="font-medium">開催場所：</span>
                    {basicInfo.location}
                  </p>
                </div>
              )}
            </section>

            <Separator />

            {/* Summary */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【セミナー概要】</h3>
              {isEditMode && editedReport ? (
                <Textarea
                  value={editedReport.summary}
                  onChange={(e) => setEditedReport({ ...editedReport, summary: e.target.value })}
                  rows={4}
                  data-testid="textarea-edit-summary"
                />
              ) : (
                <p className="text-sm leading-relaxed">{report.summary}</p>
              )}
            </section>

            <Separator />

            {/* Learnings */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【学んだこと】</h3>
              {isEditMode && editedReport ? (
                <div className="space-y-2">
                  {editedReport.learnings.map((learning, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-sm mt-2">•</span>
                      <Textarea
                        value={learning}
                        onChange={(e) => {
                          const newLearnings = [...editedReport.learnings];
                          newLearnings[idx] = e.target.value;
                          setEditedReport({ ...editedReport, learnings: newLearnings });
                        }}
                        rows={2}
                        data-testid={`textarea-edit-learning-${idx}`}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-1">
                  {report.learnings.map((learning, idx) => (
                    <li key={idx} className="text-sm flex">
                      <span className="mr-2">•</span>
                      <span>{learning}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <Separator />

            {/* Insights */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【気づき】</h3>
              {isEditMode && editedReport ? (
                <div className="space-y-2">
                  {editedReport.insights.map((insight, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-sm mt-2">•</span>
                      <Textarea
                        value={insight}
                        onChange={(e) => {
                          const newInsights = [...editedReport.insights];
                          newInsights[idx] = e.target.value;
                          setEditedReport({ ...editedReport, insights: newInsights });
                        }}
                        rows={2}
                        data-testid={`textarea-edit-insight-${idx}`}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-1">
                  {report.insights.map((insight, idx) => (
                    <li key={idx} className="text-sm flex">
                      <span className="mr-2">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <Separator />

            {/* Applications */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【今後の活用方法】</h3>
              {isEditMode && editedReport ? (
                <div className="space-y-2">
                  {editedReport.applications.map((application, idx) => (
                    <div key={idx} className="flex gap-2">
                      <span className="text-sm mt-2">□</span>
                      <Textarea
                        value={application}
                        onChange={(e) => {
                          const newApplications = [...editedReport.applications];
                          newApplications[idx] = e.target.value;
                          setEditedReport({ ...editedReport, applications: newApplications });
                        }}
                        rows={2}
                        data-testid={`textarea-edit-application-${idx}`}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-1">
                  {report.applications.map((application, idx) => (
                    <li key={idx} className="text-sm flex">
                      <span className="mr-2">□</span>
                      <span>{application}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="pt-4 text-center text-sm text-muted-foreground">以上</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
