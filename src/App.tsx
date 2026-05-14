import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CRM from "./pages/CRM";
import CRMLogin from "./pages/CRMLogin";
 import GoogleContactsCallback from "./pages/GoogleContactsCallback";
 import Sales from "./pages/Sales";
 import PrivacyPolicy from "./pages/PrivacyPolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
         <Routes>
           <Route path="/" element={<Navigate to="/vendas" replace />} />
           <Route path="/crm" element={<CRM />} />
           <Route path="/crm/login" element={<CRMLogin />} />
           <Route path="/vendas" element={<Sales />} />
           <Route path="/google-callback" element={<GoogleContactsCallback />} />
            <Route path="/google-callback2" element={<GoogleContactsCallback />} />
            <Route path="/br/politicadeprivacidade" element={<PrivacyPolicy />} />
           <Route path="*" element={<Sales />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
