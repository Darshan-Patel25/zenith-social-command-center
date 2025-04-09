
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Content from "@/pages/Content";
import CreatePost from "@/pages/CreatePost";
import Schedule from "@/pages/Schedule";
import Analytics from "@/pages/Analytics";
import Engagement from "@/pages/Engagement";
import TelegramBot from "@/pages/TelegramBot";
import Profile from "@/pages/Profile";
import Account from "@/pages/Account";
import Settings from "@/pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/content" element={<Layout><Content /></Layout>} />
          <Route path="/create-post" element={<Layout><CreatePost /></Layout>} />
          <Route path="/schedule" element={<Layout><Schedule /></Layout>} />
          <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
          <Route path="/engagement" element={<Layout><Engagement /></Layout>} />
          <Route path="/telegram-bot" element={<Layout><TelegramBot /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/account" element={<Layout><Account /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
