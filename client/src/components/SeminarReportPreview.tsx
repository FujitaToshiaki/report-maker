import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit2, Download, Send, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
            <CardTitle className="text-2xl">セミナー参加報告書</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【基本情報】</h3>
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
            </section>

            <Separator />

            {/* Summary */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【セミナー概要】</h3>
              <p className="text-sm leading-relaxed">{report.summary}</p>
            </section>

            <Separator />

            {/* Learnings */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【学んだこと】</h3>
              <ul className="space-y-1">
                {report.learnings.map((learning, idx) => (
                  <li key={idx} className="text-sm flex">
                    <span className="mr-2">•</span>
                    <span>{learning}</span>
                  </li>
                ))}
              </ul>
            </section>

            <Separator />

            {/* Insights */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【気づき】</h3>
              <ul className="space-y-1">
                {report.insights.map((insight, idx) => (
                  <li key={idx} className="text-sm flex">
                    <span className="mr-2">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </section>

            <Separator />

            {/* Applications */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【今後の活用方法】</h3>
              <ul className="space-y-1">
                {report.applications.map((application, idx) => (
                  <li key={idx} className="text-sm flex">
                    <span className="mr-2">□</span>
                    <span>{application}</span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="pt-4 text-center text-sm text-muted-foreground">以上</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
