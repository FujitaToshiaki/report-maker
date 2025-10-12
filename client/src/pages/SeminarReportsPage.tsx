import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Plus, Eye } from "lucide-react";

const sampleReports = [
  {
    id: "1",
    title: "DX推進セミナー",
    reporter: "田中 花子",
    department: "情報システム部",
    date: "2024年10月8日",
    organizer: "日本経営協会",
    location: "オンライン",
    status: "完了",
    character: "たけし先生"
  },
  {
    id: "2",
    title: "リーダーシップ研修",
    reporter: "中村 次郎",
    department: "人事部",
    date: "2024年9月25日",
    organizer: "株式会社ビジネスアカデミー",
    location: "東京会議室",
    status: "完了",
    character: "さゆり主任"
  },
  {
    id: "3",
    title: "AI活用実践講座",
    reporter: "高橋 美咲",
    department: "企画開発部",
    date: "2024年9月15日",
    organizer: "テクノロジー研究所",
    location: "大阪",
    status: "完了",
    character: "こうじ君"
  }
];

export default function SeminarReportsPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">セミナー参加報告書</h1>
            <p className="text-sm text-muted-foreground mt-1">
              AIアシスタントと対話しながらセミナー参加報告書を作成します
            </p>
          </div>
          <Button
            onClick={() => setLocation("/report-type")}
            data-testid="button-new-seminar-report"
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
                  <TableHead>セミナー名</TableHead>
                  <TableHead>報告者</TableHead>
                  <TableHead>部署</TableHead>
                  <TableHead>主催者</TableHead>
                  <TableHead>開催場所</TableHead>
                  <TableHead>日付</TableHead>
                  <TableHead>キャラクター</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleReports.map((report) => (
                  <TableRow key={report.id} data-testid={`row-seminar-report-${report.id}`}>
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>{report.reporter}</TableCell>
                    <TableCell>{report.department}</TableCell>
                    <TableCell>{report.organizer}</TableCell>
                    <TableCell>{report.location}</TableCell>
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
                        onClick={() => setLocation(`/seminar-reports/detail?id=${report.id}`)}
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
