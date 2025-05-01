
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthDialogProvider, useAuthDialog } from "@/contexts/AuthDialogContext";
import { ProductProvider } from "@/contexts/ProductContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginDialog from "@/components/LoginDialog";
import RegisterDialog from "@/components/RegisterDialog";
import Index from "./pages/Index";
import Products from "./pages/Products";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Collections from "./pages/Collections";
import ProductDetail from "./pages/ProductDetail";
import Favorites from "./pages/Favorites";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthDialogProvider>
          <ProductProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </TooltipProvider>
          </ProductProvider>
        </AuthDialogProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const AppContent = () => {
  const { isLoginOpen, isRegisterOpen, openLogin, openRegister, closeLogin, closeRegister } = useAuthDialog();

  return (
    <>
      <LoginDialog isOpen={isLoginOpen} onClose={closeLogin} onOpenRegister={openRegister} />
      <RegisterDialog isOpen={isRegisterOpen} onClose={closeRegister} onOpenLogin={openLogin} />
      
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />
        <Route path="/collections" element={<Collections />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/favorites" element={<Favorites />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
