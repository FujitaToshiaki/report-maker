import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Plus, Eye } from "lucide-react";

const sampleReports = [
  {
    id: "1",
    title: "製品A-101 バリ不良",
    reporter: "佐藤 太郎",
    department: "品質管理部",
    date: "2024年10月9日",
    product: "製品A-101",
    defectType: "バリ発生",
    rootCause: "金型の摩耗による精度低下",
    status: "対策完了",
    character: "まさる課長"
  },
  {
    id: "2",
    title: "基板 B-205 はんだ不良",
    reporter: "山本 美穂",
    department: "製造部",
    date: "2024年10月3日",
    product: "基板 B-205",
    defectType: "はんだ不良",
    rootCause: "温度設定の誤り",
    status: "対策完了",
    character: "ゆみ主任"
  },
  {
    id: "3",
    title: "部品C-330 寸法不良",
    reporter: "鈴木 健一",
    department: "検査部",
    date: "2024年9月27日",
    product: "部品C-330",
    defectType: "寸法不良",
    rootCause: "設備の経年劣化",
    status: "対策完了",
    character: "たかし技術者"
  }
];

export default function DefectReportsPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">不良品報告書</h1>
            <p className="text-sm text-muted-foreground mt-1">
              5Why分析を活用して不良品報告書を作成します
            </p>
          </div>
          <Button
            onClick={() => setLocation("/defect/basic-info")}
            data-testid="button-new-defect-report"
          >
            <Plus className="h-4 w-4 mr-2" />
            新規作成
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>報告書一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>報告書名</TableHead>
                  <TableHead>報告者</TableHead>
                  <TableHead>部署</TableHead>
                  <TableHead>製品</TableHead>
                  <TableHead>不良タイプ</TableHead>
                  <TableHead>根本原因</TableHead>
                  <TableHead>日付</TableHead>
                  <TableHead>キャラクター</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleReports.map((report) => (
                  <TableRow key={report.id} data-testid={`row-defect-report-${report.id}`}>
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>{report.reporter}</TableCell>
                    <TableCell>{report.department}</TableCell>
                    <TableCell>{report.product}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">{report.defectType}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{report.rootCause}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.character}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge>{report.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        data-testid={`button-view-${report.id}`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        詳細
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
