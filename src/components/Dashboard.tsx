import {
  TrendingUp,
  Building2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { getDashboardStats, sampleMerchants, sampleActivityLog } from '../lib/sample-data';

const statCards = [
  { key: 'totalMerchants', label: 'Total Merchants', icon: Building2, color: 'cyan' },
  { key: 'pendingApplications', label: 'Pending', icon: Clock, color: 'amber' },
  { key: 'underReview', label: 'Under Review', icon: Activity, color: 'blue' },
  { key: 'approved', label: 'Approved', icon: CheckCircle, color: 'emerald' },
];

const colorClasses: Record<string, { bg: string; icon: string; text: string }> = {
  cyan: { bg: 'bg-cyan-50', icon: 'text-cyan-600', text: 'text-cyan-700' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600', text: 'text-amber-700' },
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', text: 'text-blue-700' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', text: 'text-emerald-700' },
  red: { bg: 'bg-red-50', icon: 'text-red-600', text: 'text-red-700' },
  violet: { bg: 'bg-violet-50', icon: 'text-violet-600', text: 'text-violet-700' },
};

function getStatusColor(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-emerald-100 text-emerald-700';
    case 'pending':
      return 'bg-amber-100 text-amber-700';
    case 'under_review':
      return 'bg-blue-100 text-blue-700';
    case 'rejected':
      return 'bg-red-100 text-red-700';
    case 'suspended':
      return 'bg-slate-100 text-slate-700';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

function getStatusLabel(status: string) {
  return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function Dashboard() {
  const stats = getDashboardStats();

  const recentMerchants = [...sampleMerchants]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const pendingApprovals = sampleMerchants.filter(
    (m) => m.status === 'pending' || m.status === 'under_review'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Merchant onboarding overview</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500">Last updated:</span>
          <span className="font-medium text-slate-700">
            {formatDate(new Date().toISOString())}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const colors = colorClasses[stat.color];
          return (
            <div
              key={stat.key}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:shadow-slate-200/50 transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-lg ${colors.bg}`}>
                  <Icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>12%</span>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-slate-900">
                  {stats[stat.key as keyof typeof stats]}
                </p>
                <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Approval Rate</h3>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
              +5% vs last month
            </span>
          </div>
          <div className="flex items-end gap-4">
            <span className="text-4xl font-bold text-slate-900">{stats.approvalRate}%</span>
            <div className="flex-1">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                  style={{ width: `${stats.approvalRate}%` }}
                />
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-3">
            {stats.approved} approved of {stats.approved + stats.rejected} decisions
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Avg. Processing Time</h3>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-slate-900">{stats.avgProcessingDays}</span>
            <span className="text-slate-500 mb-1">days</span>
          </div>
          <p className="text-sm text-slate-500 mt-3">From submission to approval</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">High Risk Merchants</h3>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex items-end gap-4">
            <span className="text-4xl font-bold text-slate-900">{stats.highRiskMerchants}</span>
            <span className="text-slate-500 mb-1">flagged</span>
          </div>
          <p className="text-sm text-slate-500 mt-3">Requires enhanced due diligence</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Pending Approvals */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="p-5 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Pending Approvals</h3>
              <span className="text-sm text-slate-500">
                {pendingApprovals.length} applications
              </span>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {pendingApprovals.map((merchant) => (
              <div
                key={merchant.id}
                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 truncate">
                        {merchant.company_name}
                      </p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          merchant.status
                        )}`}
                      >
                        {getStatusLabel(merchant.status)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {merchant.industry} · {merchant.business_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-900 font-medium">
                      {formatDate(merchant.created_at)}
                    </p>
                    <p className="text-xs text-slate-500">Submitted</p>
                  </div>
                </div>
              </div>
            ))}
            {pendingApprovals.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No pending approvals</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="p-5 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Recent Activity</h3>
          </div>
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {sampleActivityLog.slice(0, 8).map((activity) => (
              <div key={activity.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.action.includes('approved')
                        ? 'bg-emerald-500'
                        : activity.action.includes('rejected')
                        ? 'bg-red-500'
                        : 'bg-cyan-500'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-slate-900 font-medium capitalize">
                      {activity.action.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatTime(activity.created_at)} · {formatDate(activity.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Status Distribution</h3>
          <div className="space-y-3">
            {[
              { label: 'Approved', value: stats.approved, color: 'bg-emerald-500', total: stats.totalMerchants },
              { label: 'Under Review', value: stats.underReview, color: 'bg-blue-500', total: stats.totalMerchants },
              { label: 'Pending', value: stats.pendingApplications, color: 'bg-amber-500', total: stats.totalMerchants },
              { label: 'Rejected', value: stats.rejected, color: 'bg-red-500', total: stats.totalMerchants },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-sm text-slate-600 w-24">{item.label}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${(item.value / item.total) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-900 w-8">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-900 mb-4">Recent Merchants</h3>
          <div className="space-y-3">
            {recentMerchants.map((merchant) => (
              <div key={merchant.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{merchant.trading_name || merchant.company_name}</p>
                    <p className="text-xs text-slate-500">{merchant.industry}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(merchant.status)}`}>
                  {getStatusLabel(merchant.status)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
