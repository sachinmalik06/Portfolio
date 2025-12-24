import { Toaster } from "@/components/ui/sonner";
import { InstrumentationProvider } from "@/instrumentation.tsx";
import { SupabaseAuthProvider } from "@/components/providers/SupabaseAuthProvider";
import { MetaTags } from "@/components/MetaTags";
import { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";
import "./types/global.d.ts";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Expertise = lazy(() => import("./pages/Expertise.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Admin Components
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.tsx"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard.tsx"));
const ExpertiseManager = lazy(() => import("./pages/admin/ExpertiseManager.tsx"));
const TimelineManager = lazy(() => import("./pages/admin/TimelineManager.tsx"));
const PagesManager = lazy(() => import("./pages/admin/PagesManager.tsx"));
const FooterManager = lazy(() => import("./pages/admin/FooterManager.tsx"));
const MetaTagsManager = lazy(() => import("./pages/admin/MetaTagsManager.tsx"));
const Settings = lazy(() => import("./pages/admin/Settings.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

function ScrollToTop() {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <InstrumentationProvider>
      <SupabaseAuthProvider>
        <BrowserRouter>
          <MetaTags />
          <RouteSyncer />
          <ScrollToTop />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<AuthPage redirectAfterAuth="/admin" />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/expertise" element={<Expertise />} />
              <Route path="/about" element={<About />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="expertise" element={<ExpertiseManager />} />
                <Route path="timeline" element={<TimelineManager />} />
                <Route path="pages" element={<PagesManager />} />
              <Route path="footer" element={<FooterManager />} />
              <Route path="meta-tags" element={<MetaTagsManager />} />
              <Route path="settings" element={<Settings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </SupabaseAuthProvider>
    </InstrumentationProvider>
  </StrictMode>,
);