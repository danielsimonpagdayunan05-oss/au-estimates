import { Route, Routes, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { LandingPage } from "@/pages/LandingPage";

const EstimatePage = lazy(() => import("@/pages/EstimatePage").then((m) => ({ default: m.EstimatePage })));
const SummaryPage = lazy(() => import("@/pages/SummaryPage").then((m) => ({ default: m.SummaryPage })));

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

export default function App() {
  const { pathname } = useLocation();
  const showMobileNav = pathname === "/";

  return (
    <div className="min-h-screen bg-white dark:bg-ink-950">
      <ScrollToTop />
      <Navbar />
      <main className={showMobileNav ? "pb-20 sm:pb-0" : ""}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/estimate" element={<EstimatePage />} />
            <Route path="/summary" element={<SummaryPage />} />
          </Routes>
        </Suspense>
      </main>
      {showMobileNav && <MobileNav />}
    </div>
  );
}
