import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminGuard } from './components/AdminGuard';
import { UserLayout } from './layouts/UserLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { UserReportPage } from './pages/UserReportPage';
import { UserGuidePage } from './pages/UserGuidePage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScanPage } from './pages/ScanPage';
import { HistoryPage } from './pages/HistoryPage';
import { ResearchPage } from './pages/ResearchPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { BlockPage } from './pages/BlockPage';

const RootRedirect: React.FC = () => {
  const { isAdmin } = useAuth();
  const isPort3001 = window.location.port === '3001';

  if (isPort3001 && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/user/scan" replace />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Smart Root Redirect according to Local Port and User Role */}
          <Route path="/" element={<RootRedirect />} />

          {/* Authentication Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* User Portal */}
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<Navigate to="/user/scan" replace />} />
            <Route path="scan" element={<ScanPage />} />
            <Route path="dashboard" element={<UserDashboardPage />} />
            <Route
              path="history"
              element={
                <HistoryPage
                  onlyMine={true}
                  title="Lịch Sử Quét Cá Nhân Của Bạn"
                  subtitle="Chỉ hiển thị các lượt kiểm tra liên kết được thực hiện bởi tài khoản này"
                />
              }
            />
            <Route path="report" element={<UserReportPage />} />
            <Route path="guide" element={<UserGuidePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
          </Route>

          {/* Admin Portal (Local Port :3001 / Mode: Admin) Protected by AdminGuard */}
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="settings" element={<SettingsPage defaultTab="policy" />} />
            <Route path="policy" element={<SettingsPage defaultTab="allowlist" />} />
            <Route
              path="logs"
              element={
                <HistoryPage
                  onlyMine={false}
                  title="Nhật Ký Quét Toàn Hệ Thống (Audit Logs)"
                  subtitle="Giám sát toàn bộ lượt quét từ người dùng và hệ thống theo thời gian thực"
                />
              }
            />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="research" element={<ResearchPage />} />
            <Route path="architecture" element={<ArchitecturePage />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Backwards-compatibility aliases */}
          <Route path="/scan" element={<Navigate to="/user/scan" replace />} />
          <Route path="/history" element={<Navigate to="/user/history" replace />} />
          <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />
          <Route path="/research" element={<Navigate to="/admin/research" replace />} />
          <Route path="/architecture" element={<Navigate to="/admin/architecture" replace />} />
          <Route path="/about" element={<Navigate to="/user/about" replace />} />

          {/* Standalone Blocked Warning Page */}
          <Route path="/blocked" element={<BlockPage />} />

          {/* Catch-all */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
