import { useState } from 'react';
import {
  ClipboardCheck,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Building2,
  Mail,
  Phone,
  FileText,
  MessageSquare,
  Send,
  History,
  Gavel,
  User,
} from 'lucide-react';
import { sampleMerchants, getMerchantWithDetails, type MerchantWithDetails, sampleReviews } from '../lib/sample-data';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'approved':
      return {
        label: 'Approved',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        dotColor: 'bg-emerald-500',
      };
    case 'pending':
      return {
        label: 'Pending',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        dotColor: 'bg-amber-500',
      };
    case 'under_review':
      return {
        label: 'Under Review',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        dotColor: 'bg-blue-500',
      };
    case 'rejected':
      return {
        label: 'Rejected',
        color: 'bg-red-100 text-red-700 border-red-200',
        dotColor: 'bg-red-500',
      };
    default:
      return {
        label: status,
        color: 'bg-slate-100 text-slate-600 border-slate-200',
        dotColor: 'bg-slate-400',
      };
  }
}

const decisionOptions = [
  { value: 'approved', label: 'Approve', icon: CheckCircle, color: 'emerald' },
  { value: 'rejected', label: 'Reject', icon: XCircle, color: 'red' },
  { value: 'pending_more_info', label: 'Request More Info', icon: MessageSquare, color: 'amber' },
];

export function AdminReview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantWithDetails | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [activeDecision, setActiveDecision] = useState<string | null>(null);

  const pendingMerchants = sampleMerchants.filter(
    (m) => m.status === 'pending' || m.status === 'under_review'
  );

  const filteredMerchants = pendingMerchants.filter((merchant) => {
    const matchesSearch =
      merchant.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (merchant.trading_name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesStatus = statusFilter === 'all' || merchant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const openReviewModal = (merchant: MerchantWithDetails) => {
    setSelectedMerchant(merchant);
    setReviewNote('');
    setActiveDecision(null);
  };

  const closeReviewModal = () => {
    setSelectedMerchant(null);
    setReviewNote('');
    setActiveDecision(null);
  };

  const merchantReviews = selectedMerchant
    ? sampleReviews.filter((r) => r.merchant_id === selectedMerchant.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Review Panel</h1>
          <p className="text-slate-500 mt-1">Review and process merchant applications</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-amber-100 text-amber-700 text-sm font-medium rounded-lg">
            {pendingMerchants.length} Pending Review
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Pending Initial Review</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {sampleMerchants.filter((m) => m.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Under Review</span>
            <Building2 className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {sampleMerchants.filter((m) => m.status === 'under_review').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">High Risk Applications</span>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {pendingMerchants.filter((m) => m.risk_level === 'high').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search applications..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm bg-white appearance-none cursor-pointer"
              >
                <option value="all">All Pending</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Applications Queue */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredMerchants.map((merchant) => {
            const details = getMerchantWithDetails(merchant.id) as MerchantWithDetails;
            const statusConfig = getStatusConfig(merchant.status);
            const isExpanded = expandedId === merchant.id;

            return (
              <div key={merchant.id} className="hover:bg-slate-50/50 transition-colors">
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

                    <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-slate-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-900">{merchant.company_name}</h3>
                        {/* Risk Badge */}
                        <div
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            merchant.risk_level === 'high'
                              ? 'bg-red-100 text-red-700'
                              : merchant.risk_level === 'medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {merchant.risk_level.toUpperCase()} RISK
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-sm text-slate-600">{merchant.industry}</span>
                        <span className="text-slate-300">|</span>
                        <span className="text-sm text-slate-500">
                          Applied: {formatDate(merchant.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${statusConfig.color}`}
                    >
                      <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`} />
                      <span className="text-sm font-medium">{statusConfig.label}</span>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openReviewModal(details)}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Gavel className="w-4 h-4" />
                        Review
                      </button>
                    </div>
                  </div>

                  {/* Expanded Preview */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-200 ml-14">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Quick Info
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p className="text-slate-900">
                              <span className="text-slate-500">Business Type:</span>{' '}
                              {merchant.business_type}
                            </p>
                            <p className="text-slate-900">
                              <span className="text-slate-500">Employees:</span>{' '}{merchant.employee_count || 'N/A'}
                            </p>
                            <p className="text-slate-900">
                              <span className="text-slate-500">Revenue:</span>{' '}
                              {merchant.annual_revenue_range || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Contact
                          </h4>
                          {details.contacts?.[0] && (
                            <div className="space-y-1 text-sm">
                              <p className="font-medium text-slate-900">
                                {details.contacts[0].name}
                              </p>
                              <p className="text-slate-600">{details.contacts[0].email}</p>
                              {details.contacts[0].phone && (
                                <p className="text-slate-600">{details.contacts[0].phone}</p>
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            KYC Status
                          </h4>
                          <div className="text-sm">
                            <p className="text-slate-900">
                              {details.kycDocuments?.filter((d) => d.status === 'verified').length ||
                                0}{' '}
                              / {details.kycDocuments?.length || 0} documents verified
                            </p>
                            <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                              <div
                                className="h-full bg-cyan-500 rounded-full"
                                style={{
                                  width: `${
                                    details.kycDocuments?.length
                                      ? (details.kycDocuments.filter((d) => d.status === 'verified')
                                          .length /
                                          details.kycDocuments.length) *
                                        100
                                      : 0
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {filteredMerchants.length === 0 && (
            <div className="p-12 text-center">
              <ClipboardCheck className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-900 mb-1">No pending applications</h3>
              <p className="text-slate-500">All applications have been processed</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedMerchant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Gavel className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Review Application</h3>
                    <p className="text-sm text-slate-500">{selectedMerchant.company_name}</p>
                  </div>
                </div>
                <button
                  onClick={closeReviewModal}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Merchant Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Risk Level</p>
                  <p
                    className={`text-lg font-bold mt-1 ${
                      selectedMerchant.risk_level === 'high'
                        ? 'text-red-600'
                        : selectedMerchant.risk_level === 'medium'
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {selectedMerchant.risk_level.toUpperCase()}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Status</p>
                  <p className="text-lg font-bold mt-1 text-slate-900 capitalize">
                    {selectedMerchant.status.replace('_', ' ')}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Industry</p>
                  <p className="text-sm font-medium mt-1 text-slate-900">
                    {selectedMerchant.industry}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Applied</p>
                  <p className="text-sm font-medium mt-1 text-slate-900">
                    {formatDate(selectedMerchant.created_at)}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Primary Contact</h4>
                {selectedMerchant.contacts?.[0] && (
                  <div className="p-4 bg-slate-50 rounded-lg flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {selectedMerchant.contacts[0].name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {selectedMerchant.contacts[0].position}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-4 text-sm text-slate-600">
                      <a
                        href={`mailto:${selectedMerchant.contacts[0].email}`}
                        className="flex items-center gap-1 hover:text-cyan-600"
                      >
                        <Mail className="w-4 h-4" />
                        {selectedMerchant.contacts[0].email}
                      </a>
                      {selectedMerchant.contacts[0].phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {selectedMerchant.contacts[0].phone}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Documents Status */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Documents</h4>
                <div className="space-y-2">
                  {selectedMerchant.kycDocuments?.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-500" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{doc.document_name}</p>
                          <p className="text-xs text-slate-500 capitalize">
                            {doc.document_type.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
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
                  {!selectedMerchant.kycDocuments?.length && (
                    <p className="text-sm text-slate-500 text-center py-4">
                      No documents uploaded
                    </p>
                  )}
                </div>
              </div>

              {/* Previous Reviews */}
              {merchantReviews.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <History className="w-4 h-4 text-slate-500" />
                    Review History
                  </h4>
                  <div className="space-y-3">
                    {merchantReviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-4 border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-900 capitalize">
                            {review.review_type.replace(/_/g, ' ')}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatDateTime(review.created_at)}
                          </span>
                        </div>
                        {review.notes && (
                          <p className="text-sm text-slate-600">{review.notes}</p>
                        )}
                        {review.decision && (
                          <span
                            className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded text-xs font-medium ${
                              review.decision === 'approved'
                                ? 'bg-emerald-100 text-emerald-700'
                                : review.decision === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {review.decision.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Decision */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Make Decision</h4>
                <div className="grid grid-cols-3 gap-3">
                  {decisionOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = activeDecision === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setActiveDecision(option.value)}
                        className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                          isSelected
                            ? option.color === 'emerald'
                              ? 'border-emerald-500 bg-emerald-50'
                              : option.color === 'red'
                              ? 'border-red-500 bg-red-50'
                              : 'border-amber-500 bg-amber-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            option.color === 'emerald'
                              ? 'text-emerald-600'
                              : option.color === 'red'
                              ? 'text-red-600'
                              : 'text-amber-600'
                          }`}
                        />
                        <span className="text-sm font-medium text-slate-900">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">
                  Review Notes
                </h4>
                <textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Add your review notes here..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={closeReviewModal}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!activeDecision}
                className={`px-6 py-2 font-medium rounded-lg transition-colors flex items-center gap-2 ${
                  activeDecision === 'approved'
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : activeDecision === 'rejected'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : activeDecision === 'pending_more_info'
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                Submit Decision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
