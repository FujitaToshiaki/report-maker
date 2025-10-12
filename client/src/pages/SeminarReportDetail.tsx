import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ArrowLeft, Download, Edit, GraduationCap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const sampleReportData: Record<string, any> = {
  "1": {
    id: "1",
    title: "DX推進セミナー",
    reporter: "田中 花子",
    employeeId: "EMP101",
    department: "情報システム部",
    date: "2024年10月8日",
    organizer: "日本経営協会",
    location: "オンライン",
    status: "完了",
    character: "たけし先生",
    seminarOverview: "企業のデジタルトランスフォーメーション（DX）推進における最新動向と実践的なアプローチについて、事例を交えながら学ぶ1日セミナー。午前は基調講演、午後はグループワークとディスカッション形式で実施された。",
    keyLearnings: [
      "DXは単なるIT化ではなく、ビジネスモデルそのものの変革であること",
      "経営層のコミットメントと全社的な意識改革が成功の鍵",
      "小さく始めて段階的にスケールするアジャイルアプローチが有効",
      "データドリブンな意思決定の重要性"
    ],
    insights: [
      "当社の現状は「デジタイゼーション」の段階にあり、真のDXにはまだ距離がある",
      "他社事例では、現場の業務フローを可視化することから始めていた",
      "成功企業は必ずDX推進専門チームを設置している"
    ],
    futureApplication: [
      "社内業務フローの可視化プロジェクトを11月から開始（情報システム部主導）",
      "DX推進チーム設置の提案書を作成し、経営会議で提案（10月末まで）",
      "今回学んだフレームワークを用いて、部門別のDX推進ロードマップを策定（11月中旬まで）",
      "他部門の管理職向けにDX勉強会を企画（12月実施予定）"
    ],
    additionalComments: "非常に実践的な内容で、すぐに業務に活かせる知識を得られた。特に講師の「失敗事例から学ぶ」セッションが印象的で、当社が避けるべき落とし穴を事前に知ることができた。"
  },
  "2": {
    id: "2",
    title: "リーダーシップ研修",
    reporter: "中村 次郎",
    employeeId: "EMP102",
    department: "人事部",
    date: "2024年9月25日",
    organizer: "株式会社ビジネスアカデミー",
    location: "東京会議室",
    status: "完了",
    character: "さゆり主任",
    seminarOverview: "新任管理職向けのリーダーシップ研修。チームマネジメント、コミュニケーション、目標設定など、リーダーに必要なスキルを2日間で体系的に学習。ロールプレイングやケーススタディを多く取り入れた実践的な内容。",
    keyLearnings: [
      "リーダーシップスタイルは状況に応じて使い分けることが重要",
      "傾聴力がチームの信頼関係構築の基盤となる",
      "明確なビジョンの提示とメンバーの自律性のバランスが鍵",
      "1on1ミーティングの効果的な実施方法"
    ],
    insights: [
      "自分のリーダーシップスタイルは「指示型」に偏っていることに気づいた",
      "メンバーの成長段階に応じたアプローチが必要",
      "フィードバックは具体的な行動に基づいて行うべき"
    ],
    futureApplication: [
      "週1回の1on1ミーティングを全メンバーと実施（10月から開始）",
      "四半期ごとのチーム目標設定にOKR手法を導入（次期から）",
      "メンバーの強みを活かした役割分担の見直し（10月中実施）",
      "自己のリーダーシップスタイルを多様化するための行動計画策定"
    ],
    additionalComments: "同じ立場の他社の管理職との交流も有意義だった。共通の悩みを共有し、解決策を議論できたことで、自分だけではないという安心感を得られた。"
  },
  "3": {
    id: "3",
    title: "AI活用実践講座",
    reporter: "高橋 美咲",
    employeeId: "EMP103",
    department: "企画開発部",
    date: "2024年9月15日",
    organizer: "テクノロジー研究所",
    location: "大阪",
    status: "完了",
    character: "こうじ君",
    seminarOverview: "ビジネスにおける生成AI活用の最新事例と実践ノウハウを学ぶセミナー。ChatGPT、Midjourney、GitHub Copilotなどのツールを実際に使いながら、業務効率化のヒントを学んだ。",
    keyLearnings: [
      "プロンプトエンジニアリングの基本原則と効果的な質問の仕方",
      "生成AIは「創造のパートナー」として活用すべき",
      "AIツールの限界と注意点（ハルシネーション、著作権など）",
      "業務プロセスの中でAIを組み込むべきポイントの見極め方"
    ],
    insights: [
      "当社の企画業務の70%程度はAIで効率化できる可能性がある",
      "特に市場調査やレポート作成でのAI活用が有効",
      "社内でのAI活用ガイドライン策定が急務"
    ],
    futureApplication: [
      "企画書作成テンプレートにAI活用のプロセスを組み込む（10月中）",
      "部内でのAI活用勉強会を月1回開催（11月から）",
      "AI活用による業務効率化の効果測定を実施（3ヶ月後）",
      "全社向けのAI活用ガイドライン案を作成し提案（11月末まで）"
    ],
    additionalComments: "実際に手を動かしながら学べたので、明日からすぐに実践できる内容だった。特にChatGPTを使った競合分析の手法は即戦力になりそう。"
  }
};

export default function SeminarReportDetail() {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const reportId = params.get("id") || "1";
  const report = sampleReportData[reportId];

  if (!report) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <p>報告書が見つかりません</p>
          <Button onClick={() => setLocation("/seminar-reports")} className="mt-4">
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
            onClick={() => setLocation("/seminar-reports")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            一覧に戻る
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" data-testid="button-edit">
              <Edit className="h-4 w-4 mr-2" />
              編集
            </Button>
            <Button data-testid="button-download">
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
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <CardTitle className="text-2xl">{report.title}</CardTitle>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{report.date}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{report.organizer}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{report.location}</span>
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
                <p className="text-sm text-muted-foreground">開催形式</p>
                <p className="font-medium">{report.location}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seminar Overview */}
        <Card>
          <CardHeader>
            <CardTitle>セミナー概要</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{report.seminarOverview}</p>
          </CardContent>
        </Card>

        {/* Key Learnings */}
        <Card>
          <CardHeader>
            <CardTitle>学んだこと</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.keyLearnings.map((learning: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">📚</span>
                  <span className="leading-relaxed">{learning}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle>気づき・考察</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.insights.map((insight: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">💡</span>
                  <span className="leading-relaxed">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Future Application */}
        <Card>
          <CardHeader>
            <CardTitle>今後の活用方法</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.futureApplication.map((action: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">→</span>
                  <span className="leading-relaxed">{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Additional Comments */}
        {report.additionalComments && (
          <Card>
            <CardHeader>
              <CardTitle>その他所感</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">{report.additionalComments}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
