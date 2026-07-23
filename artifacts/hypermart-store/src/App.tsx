import { useEffect, useState } from "react";
import { Layout } from "./components/layout";
import Home from "./pages/home";
import Products from "./pages/products";
import Categories from "./pages/categories";
import ProductDetail from "./pages/product-detail";
import Account from "./pages/account";
import Poin from "./pages/poin";
import Level from "./pages/level";
import Voucher from "./pages/voucher";
import Checkout from "./pages/checkout";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { setupApiClient } from "@/lib/config";

const queryClient = new QueryClient();

function AppContent() {
  const [isConfigReady, setIsConfigReady] = useState(false);

  useEffect(() => {
    // Setup API client dengan config dari public/config.json
    setupApiClient()
      .then(() => {
        setIsConfigReady(true);
      })
      .catch((error) => {
        console.error("Failed to setup API client:", error);
        // Tetap lanjutkan dengan fallback config
        setIsConfigReady(true);
      });
  }, []);

  if (!isConfigReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return <Router />;
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products" component={Products} />
        <Route path="/categories" component={Categories} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route path="/account" component={Account} />
        <Route path="/poin" component={Poin} />
        <Route path="/level" component={Level} />
        <Route path="/voucher" component={Voucher} />
        <Route path="/checkout" component={Checkout} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppContent />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
