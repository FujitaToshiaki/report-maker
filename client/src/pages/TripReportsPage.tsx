import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Plus, Eye } from "lucide-react";

const sampleReports = [
  {
    id: "1",
    title: "東京本社営業会議",
    reporter: "山田 太郎",
    department: "営業部",
    date: "2024年10月5日",
    destination: "東京本社",
    status: "完了",
    character: "ますお兄さん"
  },
  {
    id: "2", 
    title: "大阪支社　新製品説明会",
    reporter: "佐藤 花子",
    department: "企画部",
    date: "2024年9月28日",
    destination: "大阪支社",
    status: "完了",
    character: "あやちゃん"
  },
  {
    id: "3",
    title: "名古屋工場　設備視察",
    reporter: "鈴木 一郎",
    department: "製造部",
    date: "2024年9月20日",
    destination: "名古屋工場",
    status: "完了",
    character: "けんじ部長"
  }
];

export default function TripReportsPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">出張報告書</h1>
            <p className="text-sm text-muted-foreground mt-1">
              AIアシスタントと対話しながら出張報告書を作成します
            </p>
          </div>
          <Button
            onClick={() => setLocation("/report-type")}
            data-testid="button-new-trip-report"
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
                  <TableHead>出張先</TableHead>
                  <TableHead>日付</TableHead>
                  <TableHead>キャラクター</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleReports.map((report) => (
                  <TableRow key={report.id} data-testid={`row-trip-report-${report.id}`}>
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>{report.reporter}</TableCell>
                    <TableCell>{report.department}</TableCell>
                    <TableCell>{report.destination}</TableCell>
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
                        onClick={() => setLocation(`/trip-reports/detail?id=${report.id}`)}
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
