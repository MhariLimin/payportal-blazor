import { useState } from 'react';
import {
  Key,
  Plus,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  Webhook,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  Code,
  Globe,
  Zap,
} from 'lucide-react';
import { getMerchantWithDetails, type MerchantWithDetails } from '../lib/sample-data';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function maskKey(key: string, visible: boolean = false) {
  if (visible) return key;
  if (key.startsWith('pk_live_') || key.startsWith('pk_test_')) {
    return key.slice(0, 12) + '...' + key.slice(-6);
  }
  return '••••••••••••••••';
}

interface APICredentialsProps {
  merchantId?: string;
}

export function APICredentials({ merchantId = '1' }: APICredentialsProps) {
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);

  const merchantDetails = getMerchantWithDetails(merchantId) as MerchantWithDetails;

  if (!merchantDetails) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <Key className="w-12 h-12 mx-auto mb-4 text-slate-300" />
        <p className="text-slate-500">Select a merchant to manage API credentials</p>
      </div>
    );
  }

  const apiCredentials = merchantDetails.apiCredentials || [];
  const webhooks = merchantDetails.webhooks || [];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys((prev) => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const availablePermissions = [
    { id: 'payments', label: 'Payments', description: 'Create and manage payments' },
    { id: 'refunds', label: 'Refunds', description: 'Process refunds' },
    { id: 'transactions', label: 'Transactions', description: 'View transaction history' },
    { id: 'customers', label: 'Customers', description: 'Manage customer records' },
    { id: 'webhooks', label: 'Webhooks', description: 'Configure webhooks' },
  ];

  const webhookEvents = [
    { id: 'payment.created', label: 'Payment Created' },
    { id: 'payment.updated', label: 'Payment Updated' },
    { id: 'payment.failed', label: 'Payment Failed' },
    { id: 'refund.created', label: 'Refund Created' },
    { id: 'payout.created', label: 'Payout Created' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">API Credentials</h1>
          <p className="text-slate-500 mt-1">
            {merchantDetails.company_name} - API keys and webhook configuration
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowWebhookModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors"
          >
            <Webhook className="w-4 h-4" />
            Add Webhook
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Key
          </button>
        </div>
      </div>

      {/* Environment Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-1">
          <div className="flex">
            <button className="flex-1 px-4 py-2.5 bg-cyan-50 text-cyan-700 font-medium rounded-lg text-sm transition-colors">
              All Environments
            </button>
            <button className="flex-1 px-4 py-2.5 text-slate-600 hover:bg-slate-50 font-medium rounded-lg text-sm transition-colors">
              Production
            </button>
            <button className="flex-1 px-4 py-2.5 text-slate-600 hover:bg-slate-50 font-medium rounded-lg text-sm transition-colors">
              Sandbox
            </button>
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">API Keys</h3>
          <span className="text-sm text-slate-500">{apiCredentials.length} keys</span>
        </div>

        {apiCredentials.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {apiCredentials.map((cred) => (
              <div key={cred.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          cred.environment === 'production'
                            ? 'bg-violet-100'
                            : 'bg-amber-100'
                        }`}
                      >
                        {cred.environment === 'production' ? (
                          <Zap className="w-4 h-4 text-violet-600" />
                        ) : (
                          <Code className="w-4 h-4 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{cred.name}</p>
                        <p className="text-xs text-slate-500">
                          Created {formatDate(cred.created_at)}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          cred.environment === 'production'
                            ? 'bg-violet-100 text-violet-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {cred.environment}
                      </span>
                    </div>

                    {/* API Key Display */}
                    <div className="flex items-center gap-2 mt-3">
                      <code className="flex-1 px-3 py-2 bg-slate-800 text-teal-400 rounded-lg text-sm font-mono overflow-x-auto">
                        {maskKey(cred.api_key, visibleKeys[cred.id])}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(cred.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title={visibleKeys[cred.id] ? 'Hide key' : 'Show key'}
                      >
                        {visibleKeys[cred.id] ? (
                          <EyeOff className="w-5 h-5 text-slate-500" />
                        ) : (
                          <Eye className="w-5 h-5 text-slate-500" />
                        )}
                      </button>
                      <button
                        onClick={() => copyToClipboard(cred.api_key, cred.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Copy key"
                      >
                        {copied === cred.id ? (
                          <Check className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Copy className="w-5 h-5 text-slate-500" />
                        )}
                      </button>
                    </div>

                    {/* Permissions */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {cred.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium capitalize"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats and Actions */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1.5 mb-1">
                        {cred.is_active ? (
                          <>
                            <ToggleRight className="w-5 h-5 text-emerald-500" />
                            <span className="text-sm font-medium text-emerald-600">Active</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-5 h-5 text-slate-400" />
                            <span className="text-sm font-medium text-slate-500">Inactive</span>
                          </>
                        )}
                      </div>
                      {cred.last_used_at && (
                        <p className="text-xs text-slate-500">
                          Last used {formatDate(cred.last_used_at)}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700"
                        title="Regenerate key"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-slate-500 hover:text-red-600"
                        title="Delete key"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Key className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No API keys</h3>
            <p className="text-slate-500">Create your first API key to start integrating</p>
          </div>
        )}
      </div>

      {/* Webhooks */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900">Webhooks</h3>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
              {webhooks.length} configured
            </span>
          </div>
        </div>

        {webhooks.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Webhook className="w-4 h-4 text-cyan-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-600 break-all font-mono">
                          {webhook.url}
                        </p>
                      </div>
                      <div
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          webhook.is_active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {webhook.is_active ? 'Active' : 'Inactive'}
                      </div>
                    </div>

                    {/* Events */}
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {webhook.events.map((event) => (
                        <span
                          key={event}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium"
                        >
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                      title="Test webhook"
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-slate-500 hover:text-red-600"
                      title="Delete webhook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Webhook className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No webhooks configured</h3>
            <p className="text-slate-500">Set up webhooks to receive real-time notifications</p>
          </div>
        )}
      </div>

      {/* Integration Guide */}
      <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl border border-cyan-100 p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Code className="w-5 h-5 text-cyan-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-2">Integration Guide</h3>
            <p className="text-sm text-slate-600 mb-4">
              Get started with our API by following the integration documentation.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#"
                className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 text-cyan-600 font-medium rounded-lg text-sm transition-colors"
              >
                <Globe className="w-4 h-4" />
                View Documentation
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 font-medium rounded-lg text-sm transition-colors"
              >
                API Reference
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 font-medium rounded-lg text-sm transition-colors"
              >
                SDKs
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Create API Key</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <Trash2 className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Key Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Production API Key"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Environment
                </label>
                <div className="flex gap-3">
                  <label className="flex-1 flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 has-[:checked]:bg-cyan-50 has-[:checked]:border-cyan-300">
                    <input type="radio" name="env" value="sandbox" className="text-cyan-600" defaultChecked />
                    <div>
                      <p className="font-medium text-slate-900">Sandbox</p>
                      <p className="text-xs text-slate-500">For testing</p>
                    </div>
                  </label>
                  <label className="flex-1 flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 has-[:checked]:bg-cyan-50 has-[:checked]:border-cyan-300">
                    <input type="radio" name="env" value="production" className="text-cyan-600" />
                    <div>
                      <p className="font-medium text-slate-900">Production</p>
                      <p className="text-xs text-slate-500">Live environment</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Permissions
                </label>
                <div className="space-y-2">
                  {availablePermissions.map((perm) => (
                    <label
                      key={perm.id}
                      className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 has-[:checked]:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        value={perm.id}
                        defaultChecked={perm.id === 'payments' || perm.id === 'transactions'}
                        className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{perm.label}</p>
                        <p className="text-xs text-slate-500">{perm.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors">
                Create Key
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Webhook Modal */}
      {showWebhookModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Add Webhook</h3>
                <button
                  onClick={() => setShowWebhookModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <Trash2 className="w-5 h-5 text-slate-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Webhook URL
                </label>
                <input
                  type="url"
                  placeholder="https://your-server.com/webhooks/payportal"
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  We'll send POST requests to this URL when events occur
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Events to Subscribe
                </label>
                <div className="space-y-2">
                  {webhookEvents.map((event) => (
                    <label
                      key={event.id}
                      className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 has-[:checked]:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        value={event.id}
                        defaultChecked
                        className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                      />
                      <span className="font-medium text-slate-900">{event.label}</span>
                      <code className="text-xs text-slate-500 ml-auto">{event.id}</code>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Security Note</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Always verify webhook signatures using the secret key provided after creation.
                    Never expose this secret publicly.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowWebhookModal(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors">
                Add Webhook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
