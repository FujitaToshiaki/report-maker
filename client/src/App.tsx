import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePageNew from "@/pages/HomePageNew";
import ReportTypePage from "@/pages/ReportTypePage";
import BasicInfoPage from "@/pages/BasicInfoPage";
import CharacterSelectionPage from "@/pages/CharacterSelectionPage";
import ChatPage from "@/pages/ChatPage";
import ReportPreviewPage from "@/pages/ReportPreviewPage";
import DefectBasicInfoPage from "@/pages/DefectBasicInfoPage";
import DefectCharacterPage from "@/pages/DefectCharacterPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePageNew} />
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
