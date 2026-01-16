import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Vault from "./pages/Vault";
import Tokens from "./pages/Tokens";
import Partners from "./pages/Partners";
import Games from "./pages/Games";
import NotFound from "./pages/NotFound";
import LoginPage from "./features/auth/presentation/pages/LoginPage";
import RegisterPage from "./features/auth/presentation/pages/RegisterPage";
import DashboardPage from "./features/dashboard/presentation/pages/DashboardPage";
import VaultCoinsPage from "./features/vaultcoins/presentation/pages/VaultCoinsPage";
import RewardsPage from "./features/rewards/presentation/pages/RewardsPage";
import WithdrawalPage from "./features/withdrawals/presentation/pages/WithdrawalPage";
import SettingsPage from "./features/settings/presentation/pages/SettingsPage";

const queryClient = new QueryClient();

// ProtectedRoute simplificado
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Em uma implementação real, verificamos o auth.user aqui
  return <>{children}</>;
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
          
          {/* Rotas Protegidas */}
          <Route path="/app" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/app/coins" element={<ProtectedRoute><VaultCoinsPage /></ProtectedRoute>} />
          <Route path="/app/rewards" element={<ProtectedRoute><RewardsPage /></ProtectedRoute>} />
          <Route path="/app/withdrawals" element={<ProtectedRoute><WithdrawalPage /></ProtectedRoute>} />
          <Route path="/app/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          
          {/* Features Legadas/Existentes (Futuramente movidas para sub-rotas de /app) */}
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