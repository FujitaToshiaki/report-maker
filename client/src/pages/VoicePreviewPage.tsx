import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, ArrowLeft, Save } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface VoiceReportData {
  report: Record<string, unknown>;
  reportType: "trip" | "seminar" | "defect";
  basicInfo: Record<string, string>;
}

const REPORT_TYPE_LABELS = {
  trip: "出張報告書",
  seminar: "セミナー参加報告書",
  defect: "不良品報告書",
};

function TripReportView({ report, basicInfo }: { report: Record<string, unknown>; basicInfo: Record<string, string> }) {
  const activities = Array.isArray(report.activities) ? (report.activities as string[]) : [];
  const achievements = Array.isArray(report.achievements) ? (report.achievements as string[]) : [];
  const issues = Array.isArray(report.issues) ? (report.issues as { issue: string; cause: string }[]) : [];
  const actions = Array.isArray(report.actions) ? (report.actions as { action: string; deadline?: string; person?: string }[]) : [];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 text-sm">
        {basicInfo.reporterName && <div><span className="text-muted-foreground">報告者：</span>{basicInfo.reporterName}</div>}
        {basicInfo.date && <div><span className="text-muted-foreground">日程：</span>{basicInfo.date}</div>}
        {basicInfo.destination && <div className="col-span-2"><span className="text-muted-foreground">出張先：</span>{basicInfo.destination}</div>}
      </div>
      {!!report.purpose && <Section title="出張目的"><p className="text-sm">{String(report.purpose)}</p></Section>}
      {activities.length > 0 && (
        <Section title="活動内容">
          <ul className="list-disc list-inside text-sm space-y-1">{activities.map((a, i) => <li key={i}>{a}</li>)}</ul>
        </Section>
      )}
      {achievements.length > 0 && (
        <Section title="成果">
          <ul className="list-disc list-inside text-sm space-y-1">{achievements.map((a, i) => <li key={i}>{a}</li>)}</ul>
        </Section>
      )}
      {issues.length > 0 && (
        <Section title="課題">
          <ul className="text-sm space-y-1">{issues.map((item, i) => <li key={i}>• {item.issue}{item.cause ? `（原因：${item.cause}）` : ""}</li>)}</ul>
        </Section>
      )}
      {actions.length > 0 && (
        <Section title="今後のアクション">
          <ul className="text-sm space-y-1">{actions.map((a, i) => <li key={i}>• {a.action}{a.deadline ? ` ／ 期限：${a.deadline}` : ""}{a.person ? ` ／ 担当：${a.person}` : ""}</li>)}</ul>
        </Section>
      )}
      {!!report.impression && <Section title="所感"><p className="text-sm">{String(report.impression)}</p></Section>}
    </div>
  );
}

function SeminarReportView({ report, basicInfo }: { report: Record<string, unknown>; basicInfo: Record<string, string> }) {
  const learnings = Array.isArray(report.learnings) ? (report.learnings as string[]) : [];
  const insights = Array.isArray(report.insights) ? (report.insights as string[]) : [];
  const applications = Array.isArray(report.applications) ? (report.applications as string[]) : [];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 text-sm">
        {basicInfo.reporterName && <div><span className="text-muted-foreground">報告者：</span>{basicInfo.reporterName}</div>}
        {basicInfo.date && <div><span className="text-muted-foreground">開催日：</span>{basicInfo.date}</div>}
        {basicInfo.seminarName && <div className="col-span-2"><span className="text-muted-foreground">セミナー名：</span>{basicInfo.seminarName}</div>}
      </div>
      {!!report.summary && <Section title="概要"><p className="text-sm">{String(report.summary)}</p></Section>}
      {learnings.length > 0 && <Section title="学んだこと"><ul className="list-disc list-inside text-sm space-y-1">{learnings.map((l, i) => <li key={i}>{l}</li>)}</ul></Section>}
      {insights.length > 0 && <Section title="気づき"><ul className="list-disc list-inside text-sm space-y-1">{insights.map((ins, i) => <li key={i}>{ins}</li>)}</ul></Section>}
      {applications.length > 0 && <Section title="活用方法"><ul className="list-disc list-inside text-sm space-y-1">{applications.map((a, i) => <li key={i}>{a}</li>)}</ul></Section>}
    </div>
  );
}

function DefectReportView({ report, basicInfo }: { report: Record<string, unknown>; basicInfo: Record<string, string> }) {
  const fourM = typeof report.fourM === "object" && report.fourM !== null ? (report.fourM as Record<string, string>) : null;
  const fiveWhy = typeof report.fiveWhy === "object" && report.fiveWhy !== null ? (report.fiveWhy as Record<string, string>) : null;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 text-sm">
        {basicInfo.reporterName && <div><span className="text-muted-foreground">報告者：</span>{basicInfo.reporterName}</div>}
        {basicInfo.date && <div><span className="text-muted-foreground">発生日：</span>{basicInfo.date}</div>}
        {basicInfo.productName && <div className="col-span-2"><span className="text-muted-foreground">対象：</span>{basicInfo.productName}</div>}
      </div>
      {!!report.defectDescription && <Section title="不良内容"><p className="text-sm">{String(report.defectDescription)}</p></Section>}
      {fourM && (
        <Section title="4M分析">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {(["man","machine","material","method"] as const).map(k => fourM[k] ? <div key={k}><span className="text-muted-foreground capitalize">{k}：</span>{fourM[k]}</div> : null)}
          </div>
        </Section>
      )}
      {fiveWhy && (
        <Section title="なぜなぜ5回">
          <ol className="text-sm space-y-1 list-decimal list-inside">
            {(["why1","why2","why3","why4","why5"] as const).map(k => fiveWhy[k] ? <li key={k}>{fiveWhy[k]}</li> : null)}
          </ol>
        </Section>
      )}
      {!!report.immediateAction && <Section title="応急処置"><p className="text-sm">{String(report.immediateAction)}</p></Section>}
      {!!report.permanentAction && <Section title="恒久対策"><p className="text-sm">{String(report.permanentAction)}</p></Section>}
      {!!report.horizontalDeployment && <Section title="水平展開"><p className="text-sm">{String(report.horizontalDeployment)}</p></Section>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{title}</h3>
      <div className="bg-muted/40 rounded-lg px-3 py-2">{children}</div>
    </div>
  );
}

export default function VoicePreviewPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [data, setData] = useState<VoiceReportData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("voiceReportData");
    if (raw) {
      try {
        setData(JSON.parse(raw));
      } catch {
        setLocation("/voice");
      }
    } else {
      setLocation("/voice");
    }
  }, [setLocation]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!data) throw new Error("データがありません");
      const endpoint =
        data.reportType === "trip"
          ? "/api/reports/trip"
          : data.reportType === "seminar"
          ? "/api/reports/seminar"
          : "/api/reports/defect";
      return apiRequest("POST", endpoint, {
        ...data.basicInfo,
        reportData: data.report,
      });
    },
    onSuccess: () => {
      toast({ title: "保存しました", description: "報告書を保存しました。" });
      sessionStorage.removeItem("voiceReportData");
      const dest =
        data?.reportType === "trip"
          ? "/trip-reports"
          : data?.reportType === "seminar"
          ? "/seminar-reports"
          : "/defect-reports";
      setTimeout(() => setLocation(dest), 800);
    },
    onError: (err) => {
      toast({
        title: "保存失敗",
        description: err instanceof Error ? err.message : "保存に失敗しました",
        variant: "destructive",
      });
    },
  });

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="h-5 w-5 text-emerald-500" />
            <h1 className="text-xl font-bold">報告書が完成しました</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            音声インタビューをもとにAIが生成しました。内容を確認して保存してください。
          </p>
        </div>
        <Badge variant="secondary">{REPORT_TYPE_LABELS[data.reportType]}</Badge>
      </div>

      {/* Report card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{REPORT_TYPE_LABELS[data.reportType]}</CardTitle>
        </CardHeader>
        <CardContent>
          {data.reportType === "trip" && (
            <TripReportView report={data.report} basicInfo={data.basicInfo} />
          )}
          {data.reportType === "seminar" && (
            <SeminarReportView report={data.report} basicInfo={data.basicInfo} />
          )}
          {data.reportType === "defect" && (
            <DefectReportView report={data.report} basicInfo={data.basicInfo} />
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setLocation("/voice")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          やり直す
        </Button>
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="flex items-center gap-2 flex-1"
        >
          {saveMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          保存する
        </Button>
      </div>
    </div>
  );
}
