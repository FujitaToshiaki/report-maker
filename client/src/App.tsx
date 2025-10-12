import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileText } from "lucide-react";
import NotFound from "@/pages/not-found";
import HomePageNew from "@/pages/HomePageNew";
import ReportTypePage from "@/pages/ReportTypePage";
import BasicInfoPage from "@/pages/BasicInfoPage";
import CharacterSelectionPage from "@/pages/CharacterSelectionPage";
import ChatPage from "@/pages/ChatPage";
import ReportPreviewPage from "@/pages/ReportPreviewPage";
import DefectBasicInfoPage from "@/pages/DefectBasicInfoPage";
import DefectCharacterPage from "@/pages/DefectCharacterPage";
import SeminarBasicInfoPage from "@/pages/SeminarBasicInfoPage";
import SeminarCharacterPage from "@/pages/SeminarCharacterPage";
import TripReportsPage from "@/pages/TripReportsPage";
import SeminarReportsPage from "@/pages/SeminarReportsPage";
import DefectReportsPage from "@/pages/DefectReportsPage";
import TripReportDetail from "@/pages/TripReportDetail";
import SeminarReportDetail from "@/pages/SeminarReportDetail";
import DefectReportDetail from "@/pages/DefectReportDetail";
import SettingsPage from "@/pages/SettingsPage";
import HelpPage from "@/pages/HelpPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePageNew} />
      <Route path="/trip-reports" component={TripReportsPage} />
      <Route path="/trip-reports/detail" component={TripReportDetail} />
      <Route path="/seminar-reports" component={SeminarReportsPage} />
      <Route path="/seminar-reports/detail" component={SeminarReportDetail} />
      <Route path="/defect-reports" component={DefectReportsPage} />
      <Route path="/defect-reports/detail" component={DefectReportDetail} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/help" component={HelpPage} />
      <Route path="/report-type" component={ReportTypePage} />
      
      {/* Trip Report Routes */}
      <Route path="/trip/basic-info" component={BasicInfoPage} />
      <Route path="/trip/character-selection" component={CharacterSelectionPage} />
      <Route path="/trip/chat" component={ChatPage} />
      <Route path="/trip/preview" component={ReportPreviewPage} />
      
      {/* Defect Report Routes */}
      <Route path="/defect/basic-info" component={DefectBasicInfoPage} />
      <Route path="/defect/character-selection" component={DefectCharacterPage} />
      <Route path="/defect/chat" component={ChatPage} />
      <Route path="/defect/preview" component={ReportPreviewPage} />
      
      {/* Seminar Report Routes */}
      <Route path="/seminar/basic-info" component={SeminarBasicInfoPage} />
      <Route path="/seminar/character-selection" component={SeminarCharacterPage} />
      <Route path="/seminar/chat" component={ChatPage} />
      <Route path="/seminar/preview" component={ReportPreviewPage} />
      
      {/* Legacy routes for compatibility */}
      <Route path="/basic-info" component={BasicInfoPage} />
      <Route path="/character-selection" component={CharacterSelectionPage} />
      <Route path="/chat" component={ChatPage} />
      <Route path="/report-preview" component={ReportPreviewPage} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider defaultOpen={true} style={sidebarStyle as React.CSSProperties}>
          <div className="flex h-screen w-full">
            <AppSidebar />
            <div className="flex flex-col flex-1">
              <header className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <Link href="/">
                    <div className="flex items-center gap-2 hover-elevate rounded-lg px-3 py-2 cursor-pointer" data-testid="link-home">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="font-semibold">報告書アシスタント</span>
                    </div>
                  </Link>
                </div>
                <ThemeToggle />
              </header>
              <main className="flex-1 overflow-auto">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
