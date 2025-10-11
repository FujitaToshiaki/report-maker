import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Plus } from "lucide-react";

export default function TripReportsPage() {
  const [, setLocation] = useLocation();

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider defaultOpen={true} style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
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

              <div className="text-center py-12 text-muted-foreground">
                <p>まだ出張報告書がありません</p>
                <p className="text-sm mt-2">「新規作成」ボタンから作成を開始してください</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
