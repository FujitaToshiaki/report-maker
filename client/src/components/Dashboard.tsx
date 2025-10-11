import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

// Mock data - todo: remove mock functionality
const mockReports = [
  {
    id: "1",
    destination: "東京本社",
    date: "2024年1月15日",
    status: "完了",
    preview: "新製品のプレゼンテーションを実施し、好評を得ました...",
  },
  {
    id: "2",
    destination: "大阪支店",
    date: "2024年1月10日",
    status: "下書き",
    preview: "取引先との商談について...",
  },
  {
    id: "3",
    destination: "名古屋営業所",
    date: "2024年1月5日",
    status: "完了",
    preview: "新規顧客との打ち合わせを行いました...",
  },
];

export function Dashboard() {
  const completedCount = mockReports.filter(r => r.status === "完了").length;
  const draftCount = mockReports.filter(r => r.status === "下書き").length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">出張報告書作成アシスタント</h1>
          <p className="text-muted-foreground">富山弁キャラクターとの対話で、簡単に高品質な報告書を作成できます</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">総報告書数</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{mockReports.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">完了</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{completedCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">下書き</CardTitle>
              <Clock className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{draftCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* New Report Button */}
        <Link href="/basic-info">
          <Button size="lg" className="w-full md:w-auto" data-testid="button-new-report">
            <Plus className="mr-2 h-5 w-5" />
            新規報告書作成
          </Button>
        </Link>

        {/* Recent Reports */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">最近の報告書</h2>
          <div className="grid gap-4">
            {mockReports.map((report) => (
              <Card key={report.id} className="hover-elevate transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg">{report.destination}</CardTitle>
                      <CardDescription>{report.date}</CardDescription>
                    </div>
                    <Badge variant={report.status === "完了" ? "default" : "secondary"} data-testid={`badge-status-${report.id}`}>
                      {report.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{report.preview}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
