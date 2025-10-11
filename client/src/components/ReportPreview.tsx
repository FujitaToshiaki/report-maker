import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit2, Download, Send } from "lucide-react";
import { useLocation } from "wouter";

// Mock report data - todo: remove mock functionality
const mockReport = {
  basicInfo: {
    name: "山田 太郎",
    employeeId: "EMP001",
    department: "営業部",
    startDate: "2024年1月15日",
    endDate: "2024年1月15日",
    destination: "東京都千代田区",
    company: "株式会社サンプル",
    companions: "佐藤 花子",
  },
  purpose: "新製品「SmartWidget Pro」のプレゼンテーションを実施し、取引条件について協議する。また、次年度の販売計画について意見交換を行う。",
  activities: [
    "10:00-11:30 新製品プレゼンテーション実施",
    "11:30-12:30 製品デモンストレーション",
    "13:30-15:00 取引条件に関する協議",
    "15:00-16:00 次年度販売計画についての意見交換",
  ],
  achievements: [
    "新製品に対して高い評価を獲得（満足度9/10）",
    "初回ロット500個の発注内諾を取得",
    "次年度の販売目標を前年比120%に設定することで合意",
  ],
  issues: [
    {
      issue: "納期が当初予定より2週間遅れる可能性",
      cause: "部品供給の遅延が発生しているため",
    },
  ],
  actions: [
    {
      action: "部品メーカーへの状況確認と代替案の検討",
      deadline: "2024年1月20日",
      person: "山田 太郎",
    },
    {
      action: "正式な発注書の受領",
      deadline: "2024年1月25日",
      person: "佐藤 花子",
    },
  ],
  impression: "先方の製品への期待値が非常に高く、今後の取引拡大に大きな可能性を感じました。納期の課題については早急に対応し、信頼関係を維持することが重要です。",
};

export function ReportPreview() {
  const [, setLocation] = useLocation();

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
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-primary">ステップ 4/5</span>
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
            <CardTitle className="text-2xl">出張報告書</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【基本情報】</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">報告者：</span>
                  {mockReport.basicInfo.name}（{mockReport.basicInfo.department}）
                </p>
                <p>
                  <span className="font-medium">社員ID：</span>
                  <span className="font-mono">{mockReport.basicInfo.employeeId}</span>
                </p>
                <p>
                  <span className="font-medium">出張期間：</span>
                  {mockReport.basicInfo.startDate} 〜 {mockReport.basicInfo.endDate}
                </p>
                <p>
                  <span className="font-medium">出張先：</span>
                  {mockReport.basicInfo.destination} {mockReport.basicInfo.company}
                </p>
                <p>
                  <span className="font-medium">同行者：</span>
                  {mockReport.basicInfo.companions}
                </p>
              </div>
            </section>

            <Separator />

            {/* Purpose */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【出張目的】</h3>
              <p className="text-sm leading-relaxed">{mockReport.purpose}</p>
            </section>

            <Separator />

            {/* Activities */}
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">【活動内容】</h3>
              <ul className="space-y-1">
                {mockReport.activities.map((activity, idx) => (
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
                {mockReport.achievements.map((achievement, idx) => (
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
              {mockReport.issues.map((item, idx) => (
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
                {mockReport.actions.map((action, idx) => (
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
              <p className="text-sm leading-relaxed">{mockReport.impression}</p>
            </section>

            <div className="pt-4 text-center text-sm text-muted-foreground">以上</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
