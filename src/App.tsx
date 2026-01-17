import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Imports de Páginas "Containers" (Legado/Composições)
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Vault from "./pages/Vault";
import Tokens from "./pages/Tokens";
import Partners from "./pages/Partners";
import Games from "./pages/Games";
import NotFound from "./pages/NotFound";

// Imports via API Pública de Features (SCS)
import { LoginPage, RegisterPage } from "./features/auth";
import { DashboardPage } from "./features/dashboard";
import { VaultCoinsPage } from "./features/vaultcoins";
import { RewardsPage } from "./features/rewards";
import { WithdrawalPage } from "./features/withdrawals";
import { SettingsPage } from "./features/settings";
import { AffiliatesPage } from "./features/affiliates";
import { AdminDashboardPage } from "./features/admin";

const queryClient = new QueryClient();

// ProtectedRoute simplificado
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Em uma implementação real, verificamos o auth.user aqui
  return <>{children}</>;
};

// ProtectedAdminRoute simplificado
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  // Mock check: em prod, verificar auth.user.role === 'ADMIN'
  const isAdmin = true; 
  return isAdmin ? <>{children}</> : <Navigate to="/app" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Rotas Protegidas (App) */}
          <Route path="/app" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/app/coins" element={<ProtectedRoute><VaultCoinsPage /></ProtectedRoute>} />
          <Route path="/app/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
          <Route path="/app/withdrawals" element={<ProtectedRoute><WithdrawalPage /></ProtectedRoute>} />
          <Route path="/app/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          <Route path="/app/affiliates" element={<ProtectedRoute><AffiliatesPage /></ProtectedRoute>} />
          
          {/* Rotas Protegidas (Admin) */}
          <Route path="/admin" element={<ProtectedAdminRoute><AdminDashboardPage /></ProtectedAdminRoute>} />
          
          {/* Features Legadas/Existentes */}
          <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
          <Route path="/vault" element={<ProtectedRoute><Vault /></ProtectedRoute>} />
          <Route path="/tokens" element={<ProtectedRoute><Tokens /></ProtectedRoute>} />
          <Route path="/partners" element={<ProtectedRoute><Partners /></ProtectedRoute>} />
          <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;