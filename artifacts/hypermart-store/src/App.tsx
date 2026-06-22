import { Layout } from "./components/layout";
import Home from "./pages/home";
import Products from "./pages/products";
import Categories from "./pages/categories";
import ProductDetail from "./pages/product-detail";
import Account from "./pages/account";
import Poin from "./pages/poin";
import Level from "./pages/level";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

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
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
