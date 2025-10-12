import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ArrowLeft, Download, Edit, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const sampleReportData: Record<string, any> = {
  "1": {
    id: "1",
    title: "製品A-101 バリ不良",
    reporter: "佐藤 太郎",
    employeeId: "QC001",
    department: "品質管理部",
    date: "2024年10月9日",
    discoveryDate: "2024年10月8日",
    discoveryLocation: "製造ライン A-1",
    product: "製品A-101",
    lotNumber: "LOT-2024-1008",
    defectType: "バリ発生",
    defectQuantity: "50個 / 1000個",
    discoverer: "田中 一郎",
    status: "対策完了",
    character: "まさる課長",
    defectDescription: "プレス加工後の製品にバリ（突起）が発生。特に製品の角部分に顕著で、後工程での組み付け不良の原因となる可能性がある。",
    situation4M: {
      man: "作業者：山田操作員（経験5年）、当日の体調に問題なし",
      machine: "使用設備：プレス機 No.3（2015年導入、稼働時間：18,500時間）",
      material: "材料：アルミ板材 LOT-M-0810（受入検査合格品）",
      method: "作業手順：標準作業手順書 SOP-A101 Rev.3に従い実施"
    },
    whyAnalysis: [
      {
        why: "なぜバリが発生したのか？",
        answer: "金型のクリアランスが適正値より大きくなっていた"
      },
      {
        why: "なぜクリアランスが大きくなったのか？",
        answer: "金型の刃先が摩耗していた"
      },
      {
        why: "なぜ刃先が摩耗したのか？",
        answer: "金型の定期メンテナンス時期を超過していた"
      },
      {
        why: "なぜメンテナンス時期を超過したのか？",
        answer: "金型のショット数管理が正確に記録されていなかった"
      },
      {
        why: "なぜショット数が正確に記録されていなかったのか？",
        answer: "手書き記録に依存しており、記入漏れが発生していた（根本原因）"
      }
    ],
    immediateAction: [
      "不良品50個を隔離し、全数検査を実施",
      "金型を交換し、テストショットで品質確認",
      "同ロットの全製品（950個）を抜き取り検査（結果：問題なし）"
    ],
    rootCauseAction: [
      "金型管理システムにショット数自動カウント機能を導入（10月15日完了）",
      "全金型にセンサーを設置し、リアルタイムでショット数を記録",
      "メンテナンス時期の自動アラート機能を実装",
      "金型管理責任者を任命し、週次レビューを実施"
    ],
    horizontalDeployment: [
      "他の全プレス機（10台）の金型も点検し、3台で同様の摩耗を発見→即座に交換",
      "金型管理の標準化を全工場に展開（11月末まで）",
      "同様の手書き記録が残っている工程を洗い出し、デジタル化を推進"
    ],
    effectiveness: "導入後1週間の監視で、バリ不良の発生はゼロ。金型のメンテナンス実施率100%を達成。",
    preventionCompletion: "完了"
  },
  "2": {
    id: "2",
    title: "基板 B-205 はんだ不良",
    reporter: "山本 美穂",
    employeeId: "MFG002",
    department: "製造部",
    date: "2024年10月3日",
    discoveryDate: "2024年10月2日",
    discoveryLocation: "基板実装ライン",
    product: "基板 B-205",
    lotNumber: "LOT-2024-1002",
    defectType: "はんだ不良",
    defectQuantity: "15個 / 500個",
    discoverer: "鈴木 花子",
    status: "対策完了",
    character: "ゆみ主任",
    defectDescription: "基板のはんだ付け部分に「つらら状」の突起が発生。電気的な接続には問題ないが、外観品質基準を満たしていない。",
    situation4M: {
      man: "作業者：新人作業員（入社3ヶ月）、ベテラン作業員の監督下で作業",
      machine: "使用設備：リフロー炉 No.2（温度設定：ピーク240℃）",
      material: "はんだペースト：SAC305（開封後7日目）",
      method: "作業手順：標準作業手順書に従い実施、前日の設備点検で異常なし"
    },
    whyAnalysis: [
      {
        why: "なぜつらら状の突起が発生したのか？",
        answer: "はんだの温度が高すぎて流動性が増した"
      },
      {
        why: "なぜ温度が高すぎたのか？",
        answer: "リフロー炉の温度センサーが誤った値を表示していた"
      },
      {
        why: "なぜセンサーが誤った値を表示したのか？",
        answer: "センサーの校正が6ヶ月間実施されていなかった"
      },
      {
        why: "なぜ校正が実施されなかったのか？",
        answer: "校正計画が担当者の異動で引き継がれていなかった"
      },
      {
        why: "なぜ引き継がれなかったのか？",
        answer: "設備保全計画の一元管理システムがなく、個人管理に依存していた（根本原因）"
      }
    ],
    immediateAction: [
      "不良品15個を廃棄処理",
      "温度センサーの校正を実施し、設定温度を適正値に修正",
      "同ロットの全製品を目視検査（結果：他に不良なし）"
    ],
    rootCauseAction: [
      "設備保全管理システムを導入し、全設備の校正・メンテナンス計画を一元管理（10月10日完了）",
      "自動リマインド機能で担当者に校正時期を通知",
      "引継ぎ時のチェックリストに設備保全計画の確認項目を追加",
      "四半期ごとに設備保全状況をレビューする体制を構築"
    ],
    horizontalDeployment: [
      "全製造設備（30台）の校正状態を確認し、5台で校正遅延を発見→即座に実施",
      "計測器の校正管理を全部門に展開",
      "引継ぎマニュアルの全社統一化（11月実施予定）"
    ],
    effectiveness: "システム導入後、全設備の校正実施率100%を維持。はんだ不良の発生率が従来の1/10に低減。",
    preventionCompletion: "完了"
  },
  "3": {
    id: "3",
    title: "部品C-330 寸法不良",
    reporter: "鈴木 健一",
    employeeId: "INS003",
    department: "検査部",
    date: "2024年9月27日",
    discoveryDate: "2024年9月26日",
    discoveryLocation: "最終検査工程",
    product: "部品C-330",
    lotNumber: "LOT-2024-0926",
    defectType: "寸法不良",
    defectQuantity: "8個 / 200個",
    discoverer: "高橋 次郎",
    status: "対策完了",
    character: "たかし技術者",
    defectDescription: "部品の外径寸法が規格値（50.0±0.05mm）に対し、50.12mmと上限を超過。組み付け時に干渉する可能性がある。",
    situation4M: {
      man: "作業者：ベテラン作業員（経験15年）、測定技能認定取得済み",
      machine: "使用設備：NC旋盤 No.5（2010年導入、累計稼働時間：35,000時間）",
      material: "材料：SUS304丸棒 φ55（材料証明書あり、寸法公差内）",
      method: "加工条件：回転数1200rpm、送り0.15mm/rev（標準条件）"
    },
    whyAnalysis: [
      {
        why: "なぜ寸法が規格を超えたのか？",
        answer: "切削工具の摩耗により、仕上げ精度が低下していた"
      },
      {
        why: "なぜ工具が摩耗していたのか？",
        answer: "工具寿命を超えて使用していた"
      },
      {
        why: "なぜ寿命を超えて使用したのか？",
        answer: "工具交換のタイミング判断が作業者の経験則に依存していた"
      },
      {
        why: "なぜ経験則に依存していたのか？",
        answer: "工具寿命の明確な管理基準が設定されていなかった"
      },
      {
        why: "なぜ管理基準が設定されていなかったのか？",
        answer: "設備の経年劣化に伴う工具寿命の変化を定期的に見直していなかった（根本原因）"
      }
    ],
    immediateAction: [
      "不良品8個を隔離、特別採用可否を技術部門で判定（結果：再加工にて対応）",
      "新品工具に交換し、初品検査で寸法確認（OK）",
      "同日生産分192個を全数測定（結果：全て合格）"
    ],
    rootCauseAction: [
      "工具寿命管理基準を策定（加工個数ベース、設備稼働時間ベース）（10月5日完了）",
      "工具交換記録システムを導入し、寿命到達前にアラート通知",
      "設備の経年劣化を考慮した工具寿命の定期見直し（半年ごと）",
      "初品検査・中間検査の強化（従来の2倍の頻度で実施）"
    ],
    horizontalDeployment: [
      "全NC旋盤（8台）の工具状態を点検し、2台で同様の摩耗を確認→交換",
      "工具寿命管理基準を全加工設備に展開（10月末まで）",
      "ベテラン作業者のノウハウを標準化し、若手教育プログラムに組み込み"
    ],
    effectiveness: "工具管理システム導入後、寸法不良の発生率が80%削減。工具コストは適正交換により15%削減。",
    preventionCompletion: "完了"
  }
};

export default function DefectReportDetail() {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const reportId = params.get("id") || "1";
  const report = sampleReportData[reportId];

  if (!report) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <p>報告書が見つかりません</p>
          <Button onClick={() => setLocation("/defect-reports")} className="mt-4">
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
            onClick={() => setLocation("/defect-reports")}
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
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                  <CardTitle className="text-2xl">{report.title}</CardTitle>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{report.date}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <span>{report.product}</span>
                  <Separator orientation="vertical" className="h-4" />
                  <Badge variant="destructive">{report.defectType}</Badge>
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
                <p className="text-sm text-muted-foreground">発見日時</p>
                <p className="font-medium">{report.discoveryDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">発見場所</p>
                <p className="font-medium">{report.discoveryLocation}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">発見者</p>
                <p className="font-medium">{report.discoverer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ロット番号</p>
                <p className="font-medium">{report.lotNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">不良数量</p>
                <p className="font-medium text-destructive">{report.defectQuantity}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Defect Description */}
        <Card>
          <CardHeader>
            <CardTitle>不良内容</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{report.defectDescription}</p>
          </CardContent>
        </Card>

        {/* 4M Situation */}
        <Card>
          <CardHeader>
            <CardTitle>発生状況（4M）</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-primary">Man（人）</p>
              <p className="text-sm mt-1">{report.situation4M.man}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-primary">Machine（機械）</p>
              <p className="text-sm mt-1">{report.situation4M.machine}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-primary">Material（材料）</p>
              <p className="text-sm mt-1">{report.situation4M.material}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-primary">Method（方法）</p>
              <p className="text-sm mt-1">{report.situation4M.method}</p>
            </div>
          </CardContent>
        </Card>

        {/* 5 Why Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>5Why分析</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {report.whyAnalysis.map((item: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">Why {index + 1}</Badge>
                  <p className="font-medium text-sm">{item.why}</p>
                </div>
                <div className="ml-16">
                  <p className="text-sm text-muted-foreground">→ {item.answer}</p>
                </div>
                {index < report.whyAnalysis.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm font-medium text-destructive">🎯 根本原因</p>
              <p className="text-sm mt-2">{report.whyAnalysis[report.whyAnalysis.length - 1].answer}</p>
            </div>
          </CardContent>
        </Card>

        {/* Immediate Action */}
        <Card>
          <CardHeader>
            <CardTitle>応急処置</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.immediateAction.map((action: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="leading-relaxed">{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Root Cause Action */}
        <Card>
          <CardHeader>
            <CardTitle>恒久対策</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.rootCauseAction.map((action: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">→</span>
                  <span className="leading-relaxed">{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Horizontal Deployment */}
        <Card>
          <CardHeader>
            <CardTitle>水平展開</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {report.horizontalDeployment.map((action: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">📋</span>
                  <span className="leading-relaxed">{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Effectiveness */}
        <Card>
          <CardHeader>
            <CardTitle>効果確認</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed">{report.effectiveness}</p>
          </CardContent>
        </Card>

        {/* Prevention Completion */}
        <Card>
          <CardHeader>
            <CardTitle>再発防止完了確認</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-base px-4 py-1">
                {report.preventionCompletion}
              </Badge>
              <p className="text-sm text-muted-foreground">対策が完了し、効果が確認されました</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
