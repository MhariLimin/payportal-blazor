import { useState } from 'react';
import {
  Building2,
  Mail,
  Phone,
  Edit3,
  X,
  Users,
  CreditCard,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { getMerchantWithDetails, type MerchantWithDetails } from '../lib/sample-data';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'approved':
      return {
        label: 'Approved',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      };
    case 'pending':
      return {
        label: 'Pending',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
      };
    case 'under_review':
      return {
        label: 'Under Review',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
      };
    case 'rejected':
      return {
        label: 'Rejected',
        color: 'bg-red-100 text-red-700 border-red-200',
      };
    case 'suspended':
      return {
        label: 'Suspended',
        color: 'bg-slate-100 text-slate-700 border-slate-200',
      };
    default:
      return { label: status, color: 'bg-slate-100 text-slate-600 border-slate-200' };
  }
}

interface MerchantProfileProps {
  merchantId?: string;
  onNavigate?: (page: string) => void;
}

export function MerchantProfile({ merchantId = '1', onNavigate }: MerchantProfileProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const merchantDetails = getMerchantWithDetails(merchantId);
  const merchant = merchantDetails as MerchantWithDetails;

  if (!merchant) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <Building2 className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500">Select a merchant to view their profile</p>
      </div>
    );
  }

  const statusConfig = getStatusConfig(merchant.status);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 relative">
          <div className="absolute inset-0 bg-white/10" />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        </div>

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div className="w-24 h-24 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center">
              <Building2 className="w-12 h-12 text-slate-600" />
            </div>
            <div className="flex-1 pt-4 sm:pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{merchant.company_name}</h1>
                <span
                  className={`self-start sm:self-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}
                >
                  {statusConfig.label}
                </span>
                <span
                  className={`self-start sm:self-center px-2 py-0.5 rounded text-xs font-bold ${
                    merchant.risk_level === 'high'
                      ? 'bg-red-100 text-red-700'
                      : merchant.risk_level === 'medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {merchant.risk_level.toUpperCase()} RISK
                </span>
              </div>
              {merchant.trading_name && merchant.trading_name !== merchant.company_name && (
                <p className="text-slate-500 mt-1">Trading as: {merchant.trading_name}</p>
              )}
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Company Details */}
        <div className="xl:col-span-2 space-y-6">
          {/* Company Information */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Company Information</h2>
              <button
                onClick={() => setEditing(editing === 'company' ? null : 'company')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {editing === 'company' ? (
                  <X className="w-4 h-4 text-slate-500" />
                ) : (
                  <Edit3 className="w-4 h-4 text-slate-500" />
                )}
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                    Business Type
                  </label>
                  <p className="text-slate-900 font-medium">{merchant.business_type}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                    Industry
                  </label>
                  <p className="text-slate-900 font-medium">{merchant.industry || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                    Registration Number
                  </label>
                  <p className="text-slate-900 font-medium">{merchant.registration_number || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                    Tax ID
                  </label>
                  <div className="flex items-center gap-2">
                    <p className="text-slate-900 font-medium">{merchant.tax_id || 'Not provided'}</p>
                    {merchant.tax_id && (
                      <button
                        onClick={() => copyToClipboard(merchant.tax_id!, 'tax_id')}
                        className="p-1 hover:bg-slate-100 rounded"
                      >
                        {copied === 'tax_id' ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                    Founded Year
                  </label>
                  <p className="text-slate-900 font-medium">{merchant.founded_year || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                    Employee Count
                  </label>
                  <p className="text-slate-900 font-medium">{merchant.employee_count || 'Not specified'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                    Annual Revenue Range
                  </label>
                  <p className="text-slate-900 font-medium">{merchant.annual_revenue_range || 'Not specified'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <p className="text-slate-700 leading-relaxed">{merchant.description || 'No description provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Contact Information</h2>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Edit3 className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {merchant.contacts?.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-4 rounded-lg border ${
                    contact.is_primary
                      ? 'bg-cyan-50 border-cyan-100'
                      : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{contact.name}</span>
                      {contact.is_primary && (
                        <span className="text-xs bg-cyan-600 text-white px-2 py-0.5 rounded-full">
                          Primary
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-slate-500 capitalize">{contact.contact_type}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-cyan-600 hover:underline"
                      >
                        {contact.email}
                      </a>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <a
                          href={`tel:${contact.phone}`}
                          className="text-cyan-600 hover:underline"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    )}
                    {contact.position && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{contact.position}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {!merchant.contacts?.length && (
                <p className="text-slate-500 text-center py-4">No contact information provided</p>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Address Information</h2>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Edit3 className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {merchant.addresses?.map((address) => (
                  <div
                    key={address.id}
                    className={`p-4 rounded-lg border ${
                      address.is_primary
                        ? 'bg-cyan-50 border-cyan-100'
                        : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize text-slate-600">
                        {address.address_type} Address
                      </span>
                      {address.is_primary && (
                        <span className="text-xs bg-cyan-600 text-white px-2 py-0.5 rounded-full">
                          Primary
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-900">{address.street_address}</p>
                      <p className="text-slate-600">
                        {address.city}
                        {address.state && `, ${address.state}`} {address.postal_code}
                      </p>
                      <p className="text-slate-600">{address.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Banking Information */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Banking Information</h2>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <Edit3 className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {merchant.banking?.map((bank) => (
                  <div
                    key={bank.id}
                    className={`p-4 rounded-lg border ${
                      bank.is_primary
                        ? 'bg-cyan-50 border-cyan-100'
                        : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-slate-600" />
                        <span className="font-medium text-slate-900">{bank.bank_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {bank.verified ? (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Account Name</p>
                        <p className="font-medium text-slate-900">{bank.account_name}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Account Number</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900">{bank.account_number}</p>
                          <button
                            onClick={() => copyToClipboard(bank.account_number, 'account')}
                            className="p-1 hover:bg-white rounded"
                          >
                            {copied === 'account' ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-500">Currency</p>
                        <p className="font-medium text-slate-900">{bank.currency}</p>
                      </div>
                      {bank.swift_code && (
                        <div>
                          <p className="text-slate-500">SWIFT Code</p>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900">{bank.swift_code}</p>
                            <button
                              onClick={() => copyToClipboard(bank.swift_code!, 'swift')}
                              className="p-1 hover:bg-white rounded"
                            >
                              {copied === 'swift' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 text-slate-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {!merchant.banking?.length && (
                  <p className="text-slate-500 text-center py-4">No banking information provided</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Info */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Application Details</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Application Date</span>
                <span className="font-medium text-slate-900">{formatDate(merchant.created_at)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Last Updated</span>
                <span className="font-medium text-slate-900">{formatDate(merchant.updated_at)}</span>
              </div>
              {merchant.approved_at && (
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Approved Date</span>
                  <span className="font-medium text-emerald-600">{formatDate(merchant.approved_at)}</span>
                </div>
              )}
              {merchant.website && (
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Website</span>
                  <a
                    href={merchant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 hover:underline flex items-center gap-1"
                  >
                    Visit <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* KYC Progress */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">KYC Progress</h3>
              <button
                onClick={() => onNavigate?.('kyc')}
                className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
              >
                View Details
              </button>
            </div>
            <div className="relative">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all"
                  style={{
                    width: `${
                      merchant.kycMilestones
                        ? (merchant.kycMilestones.filter((m) => m.completed).length /
                            merchant.kycMilestones.length) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {merchant.kycMilestones?.filter((m) => m.completed).length || 0} of{' '}
                {merchant.kycMilestones?.length || 0} milestones completed
              </p>
            </div>
            <div className="mt-4 space-y-2">
              {merchant.kycMilestones?.slice(0, 3).map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-2">
                  {milestone.completed ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                  )}
                  <span
                    className={`text-sm ${
                      milestone.completed ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {milestone.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* API Status */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">API Access</h3>
              <button
                onClick={() => onNavigate?.('api')}
                className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
              >
                Manage
              </button>
            </div>
            <div className="space-y-3">
              {merchant.apiCredentials?.map((cred) => (
                <div
                  key={cred.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{cred.name}</p>
                    <p className="text-xs text-slate-500">{cred.environment}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      cred.is_active
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cred.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
              {!merchant.apiCredentials?.length && (
                <p className="text-sm text-slate-500 text-center py-2">
                  No API credentials configured
                </p>
              )}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {merchant.reviews?.slice(0, 3).map((review) => (
                <div key={review.id} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2" />
                  <div>
                    <p className="text-sm text-slate-900 capitalize">
                      {review.review_type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-slate-500">{formatDate(review.created_at)}</p>
                  </div>
                </div>
              ))}
              {!merchant.reviews?.length && (
                <p className="text-sm text-slate-500 text-center">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
