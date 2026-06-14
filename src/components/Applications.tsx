import { useState } from 'react';
import {
  Building2,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Calendar,
  Mail,
  Phone,
  Globe,
  MapPin,
} from 'lucide-react';
import { sampleMerchants, getMerchantWithDetails } from '../lib/sample-data';

const statusFilters = [
  { value: 'all', label: 'All Statuses', count: sampleMerchants.length },
  { value: 'pending', label: 'Pending', count: sampleMerchants.filter(m => m.status === 'pending').length },
  { value: 'under_review', label: 'Under Review', count: sampleMerchants.filter(m => m.status === 'under_review').length },
  { value: 'approved', label: 'Approved', count: sampleMerchants.filter(m => m.status === 'approved').length },
  { value: 'rejected', label: 'Rejected', count: sampleMerchants.filter(m => m.status === 'rejected').length },
];

const riskFilters = [
  { value: 'all', label: 'All Risk Levels' },
  { value: 'low', label: 'Low Risk' },
  { value: 'medium', label: 'Medium Risk' },
  { value: 'high', label: 'High Risk' },
];

function getStatusConfig(status: string) {
  switch (status) {
    case 'approved':
      return {
        label: 'Approved',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        icon: CheckCircle,
        iconColor: 'text-emerald-600',
      };
    case 'pending':
      return {
        label: 'Pending',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: Clock,
        iconColor: 'text-amber-600',
      };
    case 'under_review':
      return {
        label: 'Under Review',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: Eye,
        iconColor: 'text-blue-600',
      };
    case 'rejected':
      return {
        label: 'Rejected',
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: XCircle,
        iconColor: 'text-red-600',
      };
    case 'suspended':
      return {
        label: 'Suspended',
        color: 'bg-slate-100 text-slate-700 border-slate-200',
        icon: AlertTriangle,
        iconColor: 'text-slate-600',
      };
    default:
      return {
        label: status,
        color: 'bg-slate-100 text-slate-600 border-slate-200',
        icon: Clock,
        iconColor: 'text-slate-500',
      };
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface ApplicationsProps {
  onSelectMerchant: (merchantId: string) => void;
}

export function Applications({ onSelectMerchant }: ApplicationsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredMerchants = sampleMerchants.filter((merchant) => {
    const matchesSearch =
      merchant.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (merchant.trading_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (merchant.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesStatus = statusFilter === 'all' || merchant.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || merchant.risk_level === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Merchant Applications</h1>
          <p className="text-slate-500 mt-1">Review and manage merchant onboarding applications</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">{filteredMerchants.length} applications</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by company, trading name, or industry..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm bg-white appearance-none cursor-pointer"
              >
                {statusFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label} ({filter.count})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm bg-white appearance-none cursor-pointer"
              >
                {riskFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredMerchants.map((merchant) => {
            const statusConfig = getStatusConfig(merchant.status);
            const StatusIcon = statusConfig.icon;
            const isExpanded = expandedId === merchant.id;
            const details = getMerchantWithDetails(merchant.id);

            return (
              <div key={merchant.id} className="hover:bg-slate-50/50">
                {/* Main Row */}
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleExpand(merchant.id)}
                      className="p-1 hover:bg-slate-100 rounded transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-slate-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-900">
                          {merchant.company_name}
                        </h3>
                        {merchant.trading_name && merchant.trading_name !== merchant.company_name && (
                          <span className="text-sm text-slate-500">
                            ({merchant.trading_name})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-sm text-slate-600">{merchant.industry}</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-sm text-slate-500">
                          {merchant.business_type}
                        </span>
                        {merchant.website && (
                          <>
                            <span className="text-slate-300">|</span>
                            <a
                              href={merchant.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-cyan-600 hover:underline flex items-center gap-1"
                            >
                              <Globe className="w-3.5 h-3.5" />
                              Website
                            </a>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Risk Level */}
                      <div
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          merchant.risk_level === 'high'
                            ? 'bg-red-100 text-red-700'
                            : merchant.risk_level === 'medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {merchant.risk_level.toUpperCase()} RISK
                      </div>

                      {/* Status */}
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${statusConfig.color}`}
                      >
                        <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
                        <span className="text-sm font-medium">{statusConfig.label}</span>
                      </div>

                      {/* Actions */}
                      <button
                        onClick={() => onSelectMerchant(merchant.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5 text-slate-500" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="flex items-center gap-4 mt-3 ml-14 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Applied {formatDate(merchant.created_at)}</span>
                    </div>
                    {details?.contacts?.[0] && (
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4" />
                        <span>{details.contacts[0].email}</span>
                      </div>
                    )}
                    {details?.addresses?.[0] && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {details.addresses[0].city}, {details.addresses[0].country}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="bg-slate-50 border-t border-slate-100 p-4 ml-14">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Contact Info */}
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                          Primary Contact
                        </h4>
                        {details?.contacts?.slice(0, 2).map((contact) => (
                          <div key={contact.id} className="space-y-1">
                            <p className="font-medium text-slate-900">{contact.name}</p>
                            <p className="text-sm text-slate-600">{contact.position}</p>
                            <p className="text-sm text-slate-500">{contact.email}</p>
                            {contact.phone && (
                              <p className="text-sm text-slate-500 flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" />
                                {contact.phone}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Banking Info */}
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                          Banking Details
                        </h4>
                        {details?.banking?.slice(0, 1).map((bank) => (
                          <div key={bank.id} className="space-y-1">
                            <p className="font-medium text-slate-900">{bank.bank_name}</p>
                            <p className="text-sm text-slate-600">{bank.account_name}</p>
                            <p className="text-sm text-slate-500">
                              Account: {bank.account_number}
                            </p>
                            <p className="text-sm text-slate-500">
                              {bank.currency} {bank.account_type}
                            </p>
                            <div className="flex items-center gap-1.5 mt-2">
                              {bank.verified ? (
                                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Verified
                                </span>
                              ) : (
                                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        {!details?.banking?.length && (
                          <p className="text-sm text-slate-500">No banking details provided</p>
                        )}
                      </div>

                      {/* KYC Status */}
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                          KYC Documents
                        </h4>
                        <div className="space-y-2">
                          {details?.kycDocuments?.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between">
                              <span className="text-sm text-slate-600">
                                {doc.document_type.replace(/_/g, ' ')}
                              </span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded ${
                                  doc.status === 'verified'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : doc.status === 'rejected'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {doc.status}
                              </span>
                            </div>
                          ))}
                          {!details?.kycDocuments?.length && (
                            <p className="text-sm text-slate-500">No documents uploaded</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200">
                      <button
                        onClick={() => onSelectMerchant(merchant.id)}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        View Full Profile
                      </button>
                      <button className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg transition-colors">
                        Download Application
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredMerchants.length === 0 && (
          <div className="p-12 text-center">
            <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              No applications found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
