import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import BasicInfoPage from "@/pages/BasicInfoPage";
import CharacterSelectionPage from "@/pages/CharacterSelectionPage";
import ChatPage from "@/pages/ChatPage";
import ReportPreviewPage from "@/pages/ReportPreviewPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
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
