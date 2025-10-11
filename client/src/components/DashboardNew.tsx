import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { useLocation } from "wouter";

// Mock data - todo: remove mock functionality
const mockReports = [
  {
    id: "1",
    createdBy: { name: "山田 太郎", avatar: "" },
    status: "レビュー待ち",
    type: "出張報告書",
    destination: "東京本社",
    description: "新製品プレゼンテーション",
    date: "2024/01/15",
  },
  {
    id: "2",
    createdBy: { name: "佐藤 花子", avatar: "" },
    status: "下書き",
    type: "出張報告書",
    destination: "大阪支店",
    description: "取引先商談",
    date: "2024/01/10",
  },
  {
    id: "3",
    createdBy: { name: "鈴木 一郎", avatar: "" },
    status: "完了",
    type: "不良品報告書",
    destination: "製造ラインA",
    description: "外観不良（傷）",
    date: "2024/01/08",
  },
  {
    id: "4",
    createdBy: { name: "田中 美咲", avatar: "" },
    status: "レビュー待ち",
    type: "不良品報告書",
    destination: "検査工程",
    description: "寸法不良",
    date: "2024/01/05",
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "完了":
      return "default";
    case "レビュー待ち":
      return "secondary";
    case "下書き":
      return "outline";
    default:
      return "secondary";
  }
};

export function DashboardNew() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">ダッシュボード</h1>
          <p className="text-muted-foreground mt-1">報告書の作成と管理</p>
        </div>
        <Button onClick={() => setLocation("/report-type")} data-testid="button-new-report">
          <Plus className="mr-2 h-4 w-4" />
          新規作成
        </Button>
      </div>

      {/* New Reports Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>最近の報告書</CardTitle>
              <CardDescription>作成された報告書の一覧</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>作成者</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>種類</TableHead>
                <TableHead>場所/対象</TableHead>
                <TableHead>内容</TableHead>
                <TableHead>日付</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReports.map((report) => (
                <TableRow key={report.id} className="cursor-pointer hover-elevate" data-testid={`row-report-${report.id}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={report.createdBy.avatar} />
                        <AvatarFallback>{report.createdBy.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{report.createdBy.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(report.status)} data-testid={`badge-${report.id}`}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.destination}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{report.description}</TableCell>
                  <TableCell className="text-muted-foreground">{report.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>報告書統計</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">今月の作成数</span>
              <span className="text-2xl font-semibold">{mockReports.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">レビュー待ち</span>
              <span className="text-xl font-semibold text-chart-3">
                {mockReports.filter(r => r.status === "レビュー待ち").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">完了</span>
              <span className="text-xl font-semibold text-chart-2">
                {mockReports.filter(r => r.status === "完了").length}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>種類別</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">出張報告書</span>
              <span className="text-xl font-semibold">
                {mockReports.filter(r => r.type === "出張報告書").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">不良品報告書</span>
              <span className="text-xl font-semibold">
                {mockReports.filter(r => r.type === "不良品報告書").length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
