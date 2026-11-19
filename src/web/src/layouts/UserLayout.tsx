import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Search,
  History,
  ShieldAlert,
  BookOpen,
  ShieldCheck,
  Menu,
  User as UserIcon,
  LogOut,
  Sliders,
  Info,
} from 'lucide-react';

export const UserLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { name: 'Kiểm Tra & Quét URL', path: '/user/scan', icon: Search },
    { name: 'Tổng Quan An Toàn', path: '/user/dashboard', icon: LayoutDashboard },
    { name: 'Lịch Sử Của Tôi', path: '/user/history', icon: History },
    { name: 'Báo Cáo Link Xấu', path: '/user/report', icon: ShieldAlert },
    { name: 'Cẩm Nang An Toàn Cho Trẻ', path: '/user/guide', icon: BookOpen },
    { name: 'Giới Thiệu Hệ Thống', path: '/user/about', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      <div className="flex-1 flex">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Sidebar for User */}
        <aside
          className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0a0f1d] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Brand header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-white text-base tracking-tight">
                VN-MURL SafeWeb
              </div>
              <div className="text-[11px] text-emerald-400 font-medium">Bảo vệ lướt web an toàn</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Security Status Box */}
          <div className="p-4 mx-4 mb-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Lá Chắn Bảo Vệ Bật
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Tự động nhận diện lừa đảo trực tuyến và lọc nội dung độc hại với trẻ em bằng trí tuệ nhân tạo.
            </p>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          {/* Clean User Top Navbar */}
          <header className="sticky top-0 z-30 bg-[#0a0f1d]/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white lg:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  Cổng Thông Tin An Toàn Trực Tuyến
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Bảo Vệ Đang Bật
                  </span>
                </h1>
                <p className="hidden md:block text-xs text-slate-400">
                  Kiểm tra liên kết độc hại, ngăn chặn lừa đảo &amp; lọc nội dung người lớn theo thời gian thực
                </p>
              </div>
            </div>

            {/* User Account & Actions Header */}
            <div className="flex items-center gap-3">
              <Link
                to="/user/scan"
                className="hidden sm:flex px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs items-center gap-1.5 shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-opacity"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Quét URL Ngay</span>
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-white font-medium">{user?.username}</span>
                  </div>

                  {user?.role === 'Admin' && (
                    <Link
                      to="/admin/dashboard"
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Chuyển đến Bảng Quản Trị Hệ Thống"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Cổng Quản Trị</span>
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    title="Đăng xuất"
                    className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Đăng Nhập</span>
                </Link>
              )}
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
