import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import DashboardPage from "../../features/dashboard/DashboardPage";
import { PageLoader } from "../../shared/components/PageLoader";
import { NotFoundPage } from "../NotFoundPage";
import { apps } from "../apps";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <Header />
      <main className="shell-main">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            {apps.map(({ path, Component }) => <Route key={path} path={path} element={<Component />} />)}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
