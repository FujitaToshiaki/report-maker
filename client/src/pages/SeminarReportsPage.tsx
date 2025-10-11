import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Plus } from "lucide-react";

export default function SeminarReportsPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
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

        <div className="text-center py-12 text-muted-foreground">
          <p>まだセミナー参加報告書がありません</p>
          <p className="text-sm mt-2">「新規作成」ボタンから作成を開始してください</p>
        </div>
      </div>
    </div>
  );
}
