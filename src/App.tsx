import { Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { LandingPage } from "@/pages/LandingPage";
import { AdminAuthProvider, useAdminAuth } from "@/lib/adminAuth";
import { EditModeToggle } from "@/components/admin/EditModeToggle";
import { AcceptInviteForm } from "@/components/admin/AcceptInviteForm";

const EstimatePage = lazy(() => import("@/pages/EstimatePage").then((m) => ({ default: m.EstimatePage })));
const SummaryPage = lazy(() => import("@/pages/SummaryPage").then((m) => ({ default: m.SummaryPage })));
const AdminPage = lazy(() => import("@/pages/AdminPage").then((m) => ({ default: m.AdminPage })));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-200 border-t-olive-500 dark:border-white/10" />
    </div>
  );
}

function AppShell() {
  const { pathname } = useLocation();
  const { inviteToken } = useAdminAuth();
  const showMobileNav = pathname === "/";
  const isAdminRoute = pathname.startsWith("/admin");

  // An invite link can land the user on any page (the redirect target is the site
  // root) — handle it here so the "set your password" step never gets missed.
  if (inviteToken) {
    return (
      <div className="min-h-screen bg-white dark:bg-ink-950">
        <AcceptInviteForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-ink-950">
      <ScrollToTop />
      {!isAdminRoute && <Navbar />}
      <main className={showMobileNav ? "pb-20 sm:pb-0" : ""}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/estimate" element={<EstimatePage />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Suspense>
      </main>
      {showMobileNav && <MobileNav />}
      {!isAdminRoute && <EditModeToggle />}
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <AppShell />
    </AdminAuthProvider>
  );
}
