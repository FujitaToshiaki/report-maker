import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertTriangle, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

const reportTypes = [
  {
    id: "trip",
    title: "出張報告書",
    description: "出張の内容や成果を報告する",
    icon: FileText,
    color: "text-primary",
    bgColor: "bg-primary/10",
    url: "/trip/basic-info",
  },
  {
    id: "defect",
    title: "不良品報告書",
    description: "不良品の原因分析と対策を報告する（5Why分析）",
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    url: "/defect/basic-info",
  },
];

export function ReportTypeSelection() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold">報告書の種類を選択</h1>
          <p className="text-muted-foreground">作成する報告書の種類を選んでください</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {reportTypes.map((type) => (
            <Card
              key={type.id}
              className="hover-elevate transition-all cursor-pointer"
              onClick={() => setLocation(type.url)}
              data-testid={`card-${type.id}`}
            >
              <CardHeader className="space-y-4">
                <div className={`h-16 w-16 rounded-2xl ${type.bgColor} flex items-center justify-center`}>
                  <type.icon className={`h-8 w-8 ${type.color}`} />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                  <CardDescription className="text-base">{type.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm font-medium text-primary">
                  <span>作成を開始</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
