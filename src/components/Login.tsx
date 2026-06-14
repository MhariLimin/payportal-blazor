import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Try a demo account below.');
    }
    setLoading(false);
  };

  const demoAccounts = [
    { email: 'admin@payportal.com', role: 'Admin', color: 'bg-violet-100 text-violet-700' },
    { email: 'reviewer@payportal.com', role: 'Reviewer', color: 'bg-amber-100 text-amber-700' },
    { email: 'sarah@techflow.io', role: 'Merchant', color: 'bg-cyan-100 text-cyan-700' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl shadow-lg shadow-cyan-500/30 mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">PayPortal</h1>
          <p className="text-slate-500 mt-1">Merchant Onboarding Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Sign in to your account</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                <span className="text-slate-600">Remember me</span>
              </label>
              <button type="button" className="text-cyan-600 hover:text-cyan-700 font-medium">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-medium rounded-lg shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-center text-sm text-slate-500 mb-3">Demo accounts</p>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => {
                    setEmail(account.email);
                    setPassword('demo1234');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group"
                >
                  <span className="text-sm text-slate-600">{account.email}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${account.color}`}>
                    {account.role}
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 text-center mt-3">
              Click to auto-fill, then any 4+ char password
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an account?{' '}
          <button className="text-cyan-600 hover:text-cyan-700 font-medium">
            Apply as merchant
          </button>
        </p>
      </div>
    </div>
  );
}
