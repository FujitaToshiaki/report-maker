import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ArrowLeft, Download, Edit, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const sampleReportData: Record<string, any> = {
  "1": {
    id: "1",
    title: "東京本社営業会議",
    reporter: "山田 太郎",
    employeeId: "EMP001",
    department: "営業部",
    date: "2024年10月5日",
    startDate: "2024年10月5日",
    endDate: "2024年10月5日",
    destination: "東京本社",
    status: "完了",
    character: "ますお兄さん",
    purpose: "第4四半期の営業戦略会議への参加と、新製品の販売計画の策定",
    activities: [
      "午前：全体会議にて営業部長より第3四半期の実績報告を聴講",
      "午後：グループディスカッションで新製品の販売戦略を検討",
      "夕方：各地域の営業責任者との個別ミーティング"
    ],
    achievements: [
      "新製品「エコプラス2000」の販売目標を四半期で500台に設定",
      "北陸地域での販路拡大のための提携先候補3社をリストアップ",
      "顧客管理システムの改善提案が承認され、来月から導入予定"
    ],
    challenges: [
      "競合他社の新製品投入により、価格競争が激化している",
      "人員不足により、新規開拓の営業活動が十分にできていない"
    ],
    nextActions: [
      "提携候補3社へのアプローチ（10月中旬までに初回訪問）",
      "新製品の販売マニュアル作成（10月末まで）",
      "営業チーム増員の人事部への申請（11月初旬）"
    ]
  },
  "2": {
    id: "2",
    title: "大阪支社　新製品説明会",
    reporter: "佐藤 花子",
    employeeId: "EMP002",
    department: "企画部",
    date: "2024年9月28日",
    startDate: "2024年9月28日",
    endDate: "2024年9月28日",
    destination: "大阪支社",
    status: "完了",
    character: "あやちゃん",
    purpose: "新製品「スマートセンサーX1」の社内向け説明会の実施",
    activities: [
      "午前：製品仕様と技術的特徴についてプレゼンテーション実施",
      "午後：営業担当者向けのデモンストレーション",
      "質疑応答セッションで現場からの意見を収集"
    ],
    achievements: [
      "参加者50名から高評価を獲得（満足度92%）",
      "営業資料の改善ポイントを15件収集",
      "大阪地域での先行販売が決定"
    ],
    challenges: [
      "技術的な質問に即答できない場面があった",
      "競合製品との比較資料が不足していた"
    ],
    nextActions: [
      "技術部門と連携してFAQ資料を作成（10月10日まで）",
      "競合分析レポートの更新（10月15日まで）"
    ]
  },
  "3": {
    id: "3",
    title: "名古屋工場　設備視察",
    reporter: "鈴木 一郎",
    employeeId: "EMP003",
    department: "製造部",
    date: "2024年9月20日",
    startDate: "2024年9月20日",
    endDate: "2024年9月20日",
    destination: "名古屋工場",
    status: "完了",
    character: "けんじ部長",
    purpose: "新規導入予定の自動化設備の視察と導入可能性の検討",
    activities: [
      "午前：最新ロボットアームの稼働状況を視察",
      "午後：工場長および設備担当者とのミーティング",
      "品質管理システムの運用状況の確認"
    ],
    achievements: [
      "自動化により生産効率が30%向上していることを確認",
      "設備投資額と投資回収期間の試算データを入手",
      "富山工場への導入計画案を策定"
    ],
    challenges: [
      "既存設備とのレイアウト調整が必要",
      "作業員の再教育プログラムの準備が必要"
    ],
    nextActions: [
      "投資計画書の作成と上申（10月5日まで）",
      "作業員向け研修プログラムの企画（10月20日まで）",
      "設備メーカーとの詳細打ち合わせ（10月中旬）"
    ]
  }
};

export default function TripReportDetail() {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const reportId = params.get("id") || "1";
  const report = sampleReportData[reportId];

  if (!report) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <p>報告書が見つかりません</p>
          <Button 
            onClick={() => setLocation("/trip-reports")} 
            className="mt-4"
            data-testid="button-back-to-list-error"
          >
            一覧に戻る
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setLocation("/trip-reports")}
            data-testid="button-back-to-list"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            一覧に戻る
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" data-testid="button-edit-report">
              <Edit className="h-4 w-4 mr-2" />
              編集
            </Button>
            <Button data-testid="button-download-pdf">
              <Download className="h-4 w-4 mr-2" />
              PDF出力
            </Button>
          </div>
        </div>

        {/* Report Title */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">{report.title}</CardTitle>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{report.date}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{report.destination}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <Badge variant="outline">{report.character}</Badge>
                  <Badge>{report.status}</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">報告者</p>
                <p className="font-medium">{report.reporter}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">社員ID</p>
                <p className="font-medium">{report.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">部署</p>
                <p className="font-medium">{report.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">出張期間</p>
                <p className="font-medium">{report.startDate} 〜 {report.endDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purpose */}
        <Card>
          <CardHeader>
            <CardTitle>出張の目的</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{report.purpose}</p>
          </CardContent>
        </Card>

        {/* Activities */}
        <Card>
          <CardHeader>
            <CardTitle>活動内容</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.activities.map((activity: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="leading-relaxed">{activity}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>成果・気づき</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.achievements.map((achievement: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="leading-relaxed">{achievement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Challenges */}
        <Card>
          <CardHeader>
            <CardTitle>課題</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.challenges.map((challenge: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-destructive mt-1">▲</span>
                  <span className="leading-relaxed">{challenge}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Next Actions */}
        <Card>
          <CardHeader>
            <CardTitle>今後のアクション</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.nextActions.map((action: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">→</span>
                  <span className="leading-relaxed">{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
