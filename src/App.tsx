import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import CRM from "./pages/CRM";
import CRMLogin from "./pages/CRMLogin";
import GoogleContactsCallback from "./pages/GoogleContactsCallback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CRM />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/crm/login" element={<CRMLogin />} />
           <Route path="/google-callback" element={<GoogleContactsCallback />} />
           <Route path="/google-callback2" element={<GoogleContactsCallback />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
