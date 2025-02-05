import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/AuthGuard";
import Index from "./pages/Index";
import Assets from "./pages/Assets";
import Maintenance from "./pages/Maintenance";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Boats from "./pages/Boats";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <AuthGuard>
                <Index />
              </AuthGuard>
            }
          />
          <Route
            path="/boats"
            element={
              <AuthGuard>
                <Boats />
              </AuthGuard>
            }
          />
          <Route
            path="/assets"
            element={
              <AuthGuard>
                <Assets />
              </AuthGuard>
            }
          />
          <Route
            path="/maintenance"
            element={
              <AuthGuard>
                <Maintenance />
              </AuthGuard>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;