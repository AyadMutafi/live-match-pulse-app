import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DisplaySettingsProvider } from "@/contexts/DisplaySettingsContext";
import Index from "./pages/Index";
import LeagueRatings from "./pages/LeagueRatings";
import About from "./pages/About";
import ClubPage from "./pages/ClubPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DisplaySettingsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/league-ratings" element={<LeagueRatings />} />
            <Route path="/club/:clubSlug" element={<ClubPage />} />
            <Route path="/about" element={<About />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DisplaySettingsProvider>
  </QueryClientProvider>
);

export default App;
