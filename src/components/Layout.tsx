import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Building2,
  ShieldCheck,
  Key,
  ClipboardCheck,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'profile', label: 'Merchant Profile', icon: Building2 },
  { id: 'kyc', label: 'KYC Verification', icon: ShieldCheck },
  { id: 'api', label: 'API Credentials', icon: Key },
  { id: 'admin', label: 'Admin Review', icon: ClipboardCheck },
];

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 h-16">
        <div className="flex items-center justify-between h-full px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-semibold text-slate-900 hidden sm:block">PayPortal</span>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search merchants, applications..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-0 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 hover:bg-slate-100 rounded-lg">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 ml-2">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-slate-600">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 hover:bg-slate-100 rounded-lg"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-200 z-40 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-50 text-cyan-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <div className="p-3 bg-gradient-to-br from-cyan-50 to-teal-50 rounded-lg">
            <p className="text-xs font-medium text-slate-700">Need Help?</p>
            <p className="text-xs text-slate-500 mt-1">Contact support team</p>
            <button className="mt-2 text-xs font-medium text-cyan-600 hover:text-cyan-700">
              View Documentation
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 min-h-screen">
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
