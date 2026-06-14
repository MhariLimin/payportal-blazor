import { useState } from 'react';
import {
  ShieldCheck,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  Trash2,
  ChevronRight,
  File,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { getMerchantWithDetails, type MerchantWithDetails } from '../lib/sample-data';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getDocumentTypeConfig(type: string) {
  switch (type) {
    case 'business_registration':
      return { label: 'Business Registration', icon: FileText };
    case 'tax_certificate':
      return { label: 'Tax Certificate', icon: FileText };
    case 'id_document':
      return { label: 'ID Document', icon: FileText };
    case 'proof_of_address':
      return { label: 'Proof of Address', icon: FileText };
    case 'bank_statement':
      return { label: 'Bank Statement', icon: FileText };
    case 'financial_statement':
      return { label: 'Financial Statement', icon: FileText };
    default:
      return { label: 'Other Document', icon: File };
  }
}

function getDocumentStatusConfig(status: string) {
  switch (status) {
    case 'verified':
      return {
        label: 'Verified',
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        icon: CheckCircle,
        iconColor: 'text-emerald-600',
      };
    case 'rejected':
      return {
        label: 'Rejected',
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: XCircle,
        iconColor: 'text-red-600',
      };
    default:
      return {
        label: 'Pending Review',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: Clock,
        iconColor: 'text-amber-600',
      };
  }
}

interface KYCVerificationProps {
  merchantId?: string;
}

export function KYCVerification({ merchantId = '1' }: KYCVerificationProps) {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const merchantDetails = getMerchantWithDetails(merchantId) as MerchantWithDetails;

  if (!merchantDetails) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500">Select a merchant to verify KYC documents</p>
      </div>
    );
  }

  const kycDocuments = merchantDetails.kycDocuments || [];
  const kycMilestones = merchantDetails.kycMilestones || [];

  const completedMilestones = kycMilestones.filter((m) => m.completed).length;
  const totalMilestones = kycMilestones.length;
  const progressPercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  const verifiedDocs = kycDocuments.filter((d) => d.status === 'verified').length;
  const pendingDocs = kycDocuments.filter((d) => d.status === 'pending').length;

  const requiredDocumentTypes = [
    { type: 'business_registration', label: 'Certificate of Incorporation', required: true },
    { type: 'tax_certificate', label: 'Tax Registration Certificate', required: true },
    { type: 'id_document', label: 'Director ID Document', required: true },
    { type: 'bank_statement', label: 'Bank Statement', required: false },
    { type: 'financial_statement', label: 'Financial Statement', required: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">KYC Verification</h1>
          <p className="text-slate-500 mt-1">
            {merchantDetails.company_name} - Document verification status
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Progress Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">Verification Progress</h3>
            <span className="text-sm text-slate-500">{completedMilestones}/{totalMilestones} steps</span>
          </div>
          <div className="relative">
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-slate-500">Started</span>
              <span className="text-xs font-medium text-cyan-600">{Math.round(progressPercentage)}% Complete</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Verified</span>
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{verifiedDocs}</p>
          <p className="text-xs text-slate-500 mt-1">Documents approved</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Pending</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{pendingDocs}</p>
          <p className="text-xs text-slate-500 mt-1">Awaiting review</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Milestones */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Verification Milestones</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {kycMilestones.map((milestone, idx) => (
                <div
                  key={milestone.id}
                  className={`flex items-start gap-4 ${
                    idx < kycMilestones.length - 1 ? 'pb-4 border-b border-slate-100' : ''
                  }`}
                >
                  <div className="relative">
                    {milestone.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300" />
                    )}
                    {idx < kycMilestones.length - 1 && (
                      <div
                        className={`absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-8 ${
                          milestone.completed ? 'bg-emerald-200' : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium ${milestone.completed ? 'text-slate-900' : 'text-slate-500'}`}>
                        {milestone.title}
                      </p>
                      {milestone.required && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Required</span>
                      )}
                    </div>
                    {milestone.description && (
                      <p className="text-sm text-slate-500 mt-0.5">{milestone.description}</p>
                    )}
                    {milestone.completed_at && (
                      <p className="text-xs text-emerald-600 mt-1">
                        Completed {formatDate(milestone.completed_at)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {!kycMilestones.length && (
                <div className="text-center py-8">
                  <p className="text-slate-500">No milestones defined</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="xl:col-span-2 space-y-4">
          {/* Required Documents */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Uploaded Documents</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {kycDocuments.map((doc) => {
                const typeConfig = getDocumentTypeConfig(doc.document_type);
                const statusConfig = getDocumentStatusConfig(doc.status);
                const StatusIcon = statusConfig.icon;
                const TypeIcon = typeConfig.icon;

                return (
                  <div
                    key={doc.id}
                    className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer ${
                      selectedDoc === doc.id ? 'bg-cyan-50' : ''
                    }`}
                    onClick={() => setSelectedDoc(selectedDoc === doc.id ? null : doc.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-6 h-6 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900 truncate">{doc.document_name}</p>
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">{typeConfig.label}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${statusConfig.color}`}
                        >
                          <StatusIcon className={`w-4 h-4 ${statusConfig.iconColor}`} />
                          {statusConfig.label}
                        </span>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                          <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${selectedDoc === doc.id ? 'rotate-90' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedDoc === doc.id && (
                      <div className="mt-4 pt-4 border-t border-slate-200 ml-16">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500">File Size</p>
                            <p className="font-medium text-slate-900">
                              {doc.file_size ? formatFileSize(doc.file_size) : 'Unknown'}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Uploaded</p>
                            <p className="font-medium text-slate-900">{formatDate(doc.uploaded_at)}</p>
                          </div>
                          {doc.verified_at && (
                            <div>
                              <p className="text-slate-500">Verified</p>
                              <p className="font-medium text-emerald-600">{formatDate(doc.verified_at)}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-slate-500">File Type</p>
                            <p className="font-medium text-slate-900">{doc.file_type || 'Unknown'}</p>
                          </div>
                        </div>

                        {doc.status === 'rejected' && doc.rejection_reason && (
                          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                            <div className="flex items-center gap-2 text-red-700 text-sm font-medium mb-1">
                              <AlertTriangle className="w-4 h-4" />
                              Rejection Reason
                            </div>
                            <p className="text-sm text-red-600">{doc.rejection_reason}</p>
                          </div>
                        )}

                        {doc.notes && (
                          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Notes</p>
                            <p className="text-sm text-slate-600">{doc.notes}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-3 mt-4">
                          <button className="flex items-center gap-2 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                            View Document
                          </button>
                          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                          {doc.status !== 'verified' && (
                            <button className="flex items-center gap-2 px-3 py-2 border border-red-200 hover:bg-red-50 text-red-600 text-sm font-medium rounded-lg transition-colors ml-auto">
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {!kycDocuments.length && (
                <div className="p-12 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">No documents uploaded</h3>
                  <p className="text-slate-500">Upload your first document to begin verification</p>
                </div>
              )}
            </div>
          </div>

          {/* Required Documents Checklist */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Document Requirements</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requiredDocumentTypes.map((req) => {
                  const hasDoc = kycDocuments.some((d) => d.document_type === req.type);
                  const isVerified = kycDocuments.some(
                    (d) => d.document_type === req.type && d.status === 'verified'
                  );
                  return (
                    <div
                      key={req.type}
                      className={`p-4 rounded-lg border ${
                        isVerified
                          ? 'bg-emerald-50 border-emerald-200'
                          : hasDoc
                          ? 'bg-amber-50 border-amber-200'
                          : req.required
                          ? 'bg-red-50 border-red-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isVerified ? (
                            <CheckCircle className="w-5 h-5 text-emerald-600" />
                          ) : hasDoc ? (
                            <Clock className="w-5 h-5 text-amber-600" />
                          ) : req.required ? (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300" />
                          )}
                          <span className="font-medium text-slate-900">{req.label}</span>
                        </div>
                        {!hasDoc && req.required && (
                          <button className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                            Upload
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Upload Document</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Document Type
                  </label>
                  <select className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                    <option value="">Select document type...</option>
                    {requiredDocumentTypes.map((r) => (
                      <option key={r.type} value={r.type}>
                        {r.label}
                      </option>
                    ))}
                    <option value="other">Other</option>
                  </select>
                </div>

                <div
                  className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center hover:border-cyan-500 hover:bg-cyan-50/50 transition-colors cursor-pointer"
                >
                  <Upload className="w-10 h-10 mx-auto mb-3 text-slate-400" />
                  <p className="text-slate-900 font-medium">
                    Drop files here or click to upload
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors">
                Upload Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
