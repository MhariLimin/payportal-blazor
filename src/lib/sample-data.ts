// Sample data for the fintech portal
import type { Merchant, MerchantContact, MerchantAddress, MerchantBanking, KYCDocument, APICredential, KYCMilestone, Webhook, ApplicationReview, ActivityLog } from './supabase';

export const sampleMerchants: Merchant[] = [
  {
    id: '1',
    company_name: 'TechFlow Solutions Inc.',
    trading_name: 'TechFlow',
    registration_number: 'US-DE-12345678',
    tax_id: '51-XXXXXXX',
    business_type: 'Technology',
    industry: 'Software & SaaS',
    website: 'https://techflow.io',
    description: 'Enterprise workflow automation platform',
    founded_year: 2019,
    employee_count: 45,
    annual_revenue_range: '$1M - $5M',
    status: 'approved',
    risk_level: 'low',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:22:00Z',
    approved_at: '2024-01-20T14:22:00Z',
    approved_by: 'admin-1'
  },
  {
    id: '2',
    company_name: 'CloudCommerce Ltd.',
    trading_name: 'CloudCommerce',
    registration_number: 'GB-98765432',
    tax_id: 'GB-XXX-XXX',
    business_type: 'E-commerce',
    industry: 'Retail',
    website: 'https://cloudcommerce.co.uk',
    description: 'Multi-channel e-commerce platform',
    founded_year: 2021,
    employee_count: 120,
    annual_revenue_range: '$10M - $50M',
    status: 'under_review',
    risk_level: 'medium',
    created_at: '2024-02-01T09:15:00Z',
    updated_at: '2024-02-10T11:30:00Z',
    approved_at: null,
    approved_by: null
  },
  {
    id: '3',
    company_name: 'PaymentPrime GmbH',
    trading_name: 'PaymentPrime',
    registration_number: 'DE-HRB-456789',
    tax_id: 'DE-XXX-XXXXX',
    business_type: 'Financial Services',
    industry: 'FinTech',
    website: 'https://paymentprime.de',
    description: 'B2B payment processing solutions',
    founded_year: 2018,
    employee_count: 85,
    annual_revenue_range: '$5M - $10M',
    status: 'pending',
    risk_level: 'low',
    created_at: '2024-02-05T14:00:00Z',
    updated_at: '2024-02-05T14:00:00Z',
    approved_at: null,
    approved_by: null
  },
  {
    id: '4',
    company_name: 'RetailHub Corp.',
    trading_name: 'RetailHub',
    registration_number: 'US-CA-7654321',
    tax_id: '94-XXXXXXX',
    business_type: 'Retail',
    industry: 'Consumer Goods',
    website: 'https://retailhub.com',
    description: 'Omnichannel retail management',
    founded_year: 2017,
    employee_count: 250,
    annual_revenue_range: '$50M - $100M',
    status: 'rejected',
    risk_level: 'high',
    created_at: '2024-01-10T08:45:00Z',
    updated_at: '2024-01-25T16:00:00Z',
    approved_at: null,
    approved_by: null
  },
  {
    id: '5',
    company_name: 'DigitalEdge Solutions',
    trading_name: 'DigitalEdge',
    registration_number: 'SG-202012345X',
    tax_id: 'SG-XXX-XXX',
    business_type: 'Technology',
    industry: 'Digital Services',
    website: 'https://digitaledge.sg',
    description: 'Digital transformation consulting',
    founded_year: 2020,
    employee_count: 35,
    annual_revenue_range: '$500K - $1M',
    status: 'approved',
    risk_level: 'low',
    created_at: '2024-01-08T11:20:00Z',
    updated_at: '2024-01-12T09:45:00Z',
    approved_at: '2024-01-12T09:45:00Z',
    approved_by: 'admin-2'
  },
  {
    id: '6',
    company_name: 'CryptoVault Inc.',
    trading_name: 'CryptoVault',
    registration_number: 'US-NV-11223344',
    tax_id: '88-XXXXXXX',
    business_type: 'Financial Services',
    industry: 'Cryptocurrency',
    website: 'https://cryptovault.io',
    description: 'Institutional crypto custody solutions',
    founded_year: 2022,
    employee_count: 28,
    annual_revenue_range: '$1M - $5M',
    status: 'under_review',
    risk_level: 'high',
    created_at: '2024-02-08T13:30:00Z',
    updated_at: '2024-02-12T10:15:00Z',
    approved_at: null,
    approved_by: null
  },
  {
    id: '7',
    company_name: 'HealthBridge Medical',
    trading_name: 'HealthBridge',
    registration_number: 'US-TX-99887766',
    tax_id: '72-XXXXXXX',
    business_type: 'Healthcare',
    industry: 'HealthTech',
    website: 'https://healthbridge.med',
    description: 'Telehealth platform for clinics',
    founded_year: 2021,
    employee_count: 150,
    annual_revenue_range: '$10M - $50M',
    status: 'approved',
    risk_level: 'low',
    created_at: '2024-01-18T10:00:00Z',
    updated_at: '2024-01-22T15:30:00Z',
    approved_at: '2024-01-22T15:30:00Z',
    approved_by: 'admin-1'
  },
  {
    id: '8',
    company_name: 'EduLearn Global',
    trading_name: 'EduLearn',
    registration_number: 'AU-ACN-123456789',
    tax_id: 'AU-XXX-XXX-XXX',
    business_type: 'Education',
    industry: 'EdTech',
    website: 'https://edulearn.global',
    description: 'Online learning management platform',
    founded_year: 2019,
    employee_count: 65,
    annual_revenue_range: '$5M - $10M',
    status: 'pending',
    risk_level: 'low',
    created_at: '2024-02-10T12:00:00Z',
    updated_at: '2024-02-10T12:00:00Z',
    approved_at: null,
    approved_by: null
  },
  {
    id: '9',
    company_name: 'LogiTech Freight',
    trading_name: 'LogiTech',
    registration_number: 'US-IL-55667788',
    tax_id: '36-XXXXXXX',
    business_type: 'Logistics',
    industry: 'Transportation',
    website: 'https://logitechfreight.com',
    description: 'Freight management and tracking',
    founded_year: 2016,
    employee_count: 180,
    annual_revenue_range: '$25M - $50M',
    status: 'approved',
    risk_level: 'medium',
    created_at: '2024-01-05T09:30:00Z',
    updated_at: '2024-01-10T14:00:00Z',
    approved_at: '2024-01-10T14:00:00Z',
    approved_by: 'admin-2'
  },
  {
    id: '10',
    company_name: 'GreenEnergy Plus',
    trading_name: 'GreenEnergy',
    registration_number: 'NL-KVK-987654321',
    tax_id: 'NL-XXX-XXXXX',
    business_type: 'Energy',
    industry: 'CleanTech',
    website: 'https://greenenergyplus.nl',
    description: 'Renewable energy marketplace',
    founded_year: 2020,
    employee_count: 42,
    annual_revenue_range: '$2M - $5M',
    status: 'suspended',
    risk_level: 'medium',
    created_at: '2024-01-12T16:45:00Z',
    updated_at: '2024-02-01T11:20:00Z',
    approved_at: '2024-01-18T10:00:00Z',
    approved_by: 'admin-1'
  }
];

export const sampleContacts: MerchantContact[] = [
  { id: 'c1', merchant_id: '1', contact_type: 'primary', name: 'Sarah Chen', email: 'sarah.chen@techflow.io', phone: '+1-555-0101', position: 'CEO', is_primary: true, created_at: '2024-01-15T10:30:00Z' },
  { id: 'c2', merchant_id: '1', contact_type: 'billing', name: 'Mark Johnson', email: 'mark.j@techflow.io', phone: '+1-555-0102', position: 'CFO', is_primary: false, created_at: '2024-01-15T10:30:00Z' },
  { id: 'c3', merchant_id: '2', contact_type: 'primary', name: 'James Wilson', email: 'james@cloudcommerce.co.uk', phone: '+44-20-1234-5678', position: 'Managing Director', is_primary: true, created_at: '2024-02-01T09:15:00Z' },
  { id: 'c4', merchant_id: '3', contact_type: 'primary', name: 'Hans Mueller', email: 'hans@paymentprime.de', phone: '+49-30-1234-5678', position: 'Founder', is_primary: true, created_at: '2024-02-05T14:00:00Z' },
  { id: 'c5', merchant_id: '5', contact_type: 'primary', name: 'David Tan', email: 'david@digitaledge.sg', phone: '+65-9123-4567', position: 'Director', is_primary: true, created_at: '2024-01-08T11:20:00Z' },
];

export const sampleAddresses: MerchantAddress[] = [
  { id: 'a1', merchant_id: '1', address_type: 'registered', street_address: '200 Innovation Drive, Suite 400', city: 'San Francisco', state: 'CA', postal_code: '94107', country: 'United States', is_primary: true, created_at: '2024-01-15T10:30:00Z' },
  { id: 'a2', merchant_id: '2', address_type: 'registered', street_address: '45 Tech City Lane', city: 'London', state: null, postal_code: 'EC2A 4NE', country: 'United Kingdom', is_primary: true, created_at: '2024-02-01T09:15:00Z' },
  { id: 'a3', merchant_id: '3', address_type: 'registered', street_address: 'Unter den Linden 10', city: 'Berlin', state: null, postal_code: '10117', country: 'Germany', is_primary: true, created_at: '2024-02-05T14:00:00Z' },
];

export const sampleBanking: MerchantBanking[] = [
  { id: 'b1', merchant_id: '1', bank_name: 'Silicon Valley Bank', account_name: 'TechFlow Solutions Inc.', account_number: '****4567', routing_number: '121144389', swift_code: 'SVBKUS6S', currency: 'USD', account_type: 'checking', is_primary: true, verified: true, created_at: '2024-01-15T10:30:00Z' },
  { id: 'b2', merchant_id: '2', bank_name: 'Barclays Bank', account_name: 'CloudCommerce Ltd.', account_number: '****8901', routing_number: null, swift_code: 'BARCGB2L', currency: 'GBP', account_type: 'checking', is_primary: true, verified: false, created_at: '2024-02-01T09:15:00Z' },
  { id: 'b3', merchant_id: '5', bank_name: 'DBS Bank', account_name: 'DigitalEdge Solutions', account_number: '****2345', routing_number: null, swift_code: 'DBSSSGSG', currency: 'SGD', account_type: 'checking', is_primary: true, verified: true, created_at: '2024-01-08T11:20:00Z' },
];

export const sampleKYCDocuments: KYCDocument[] = [
  { id: 'd1', merchant_id: '1', document_type: 'business_registration', document_name: 'Certificate of Incorporation.pdf', file_url: '/docs/inc-certificate.pdf', file_size: 245678, file_type: 'application/pdf', status: 'verified', rejection_reason: null, uploaded_at: '2024-01-15T10:35:00Z', verified_at: '2024-01-16T09:00:00Z', verified_by: 'admin-1', notes: 'Valid registration' },
  { id: 'd2', merchant_id: '1', document_type: 'tax_certificate', document_name: 'Tax Registration Certificate.pdf', file_url: '/docs/tax-cert.pdf', file_size: 156789, file_type: 'application/pdf', status: 'verified', rejection_reason: null, uploaded_at: '2024-01-15T10:40:00Z', verified_at: '2024-01-16T09:15:00Z', verified_by: 'admin-1', notes: null },
  { id: 'd3', merchant_id: '2', document_type: 'business_registration', document_name: 'Companies House Certificate.pdf', file_url: '/docs/ch-certificate.pdf', file_size: 345678, file_type: 'application/pdf', status: 'pending', rejection_reason: null, uploaded_at: '2024-02-01T09:20:00Z', verified_at: null, verified_by: null, notes: null },
  { id: 'd4', merchant_id: '4', document_type: 'business_registration', document_name: 'CA Business License.pdf', file_url: '/docs/ca-license.pdf', file_size: 198456, file_type: 'application/pdf', status: 'rejected', rejection_reason: 'Document expired - please upload current registration', uploaded_at: '2024-01-10T08:50:00Z', verified_at: '2024-01-12T14:00:00Z', verified_by: 'admin-1', notes: 'Expired document' },
];

export const sampleKYCMilestones: KYCMilestone[] = [
  { id: 'm1', merchant_id: '1', milestone_type: 'profile_completion', title: 'Complete Company Profile', description: 'Fill in all required business information', required: true, completed: true, completed_at: '2024-01-15T10:30:00Z', created_at: '2024-01-15T10:30:00Z' },
  { id: 'm2', merchant_id: '1', milestone_type: 'document_upload', title: 'Upload Required Documents', description: 'Submit business registration and tax documents', required: true, completed: true, completed_at: '2024-01-15T10:45:00Z', created_at: '2024-01-15T10:30:00Z' },
  { id: 'm3', merchant_id: '1', milestone_type: 'identity_verification', title: 'Identity Verification', description: 'Verify authorized representative identity', required: true, completed: true, completed_at: '2024-01-16T09:00:00Z', created_at: '2024-01-15T10:30:00Z' },
  { id: 'm4', merchant_id: '1', milestone_type: 'banking_setup', title: 'Banking Information', description: 'Add and verify bank account details', required: true, completed: true, completed_at: '2024-01-17T11:00:00Z', created_at: '2024-01-15T10:30:00Z' },
  { id: 'm5', merchant_id: '2', milestone_type: 'profile_completion', title: 'Complete Company Profile', description: 'Fill in all required business information', required: true, completed: true, completed_at: '2024-02-01T09:15:00Z', created_at: '2024-02-01T09:15:00Z' },
  { id: 'm6', merchant_id: '2', milestone_type: 'document_upload', title: 'Upload Required Documents', description: 'Submit business registration and tax documents', required: true, completed: true, completed_at: '2024-02-01T09:20:00Z', created_at: '2024-02-01T09:15:00Z' },
  { id: 'm7', merchant_id: '2', milestone_type: 'identity_verification', title: 'Identity Verification', description: 'Verify authorized representative identity', required: true, completed: false, completed_at: null, created_at: '2024-02-01T09:15:00Z' },
];

export const sampleAPICredentials: APICredential[] = [
  { id: 'api1', merchant_id: '1', api_key: 'pk_live_XK7mN9RqT3vL2wB5jH8kY4', api_secret_hash: 'sk_live_****', environment: 'production', name: 'Production Key', permissions: ['payments', 'refunds', 'transactions', 'customers'], last_used_at: '2024-02-14T08:30:00Z', is_active: true, created_at: '2024-01-20T14:22:00Z', expires_at: null },
  { id: 'api2', merchant_id: '1', api_key: 'pk_test_XK7mN9RqT3vL2wB5jH8kY4', api_secret_hash: 'sk_test_****', environment: 'sandbox', name: 'Test Key', permissions: ['payments', 'refunds', 'transactions'], last_used_at: '2024-02-14T10:15:00Z', is_active: true, created_at: '2024-01-20T14:22:00Z', expires_at: null },
  { id: 'api3', merchant_id: '5', api_key: 'pk_live_B8cP4VwX6nM1zQ9rK3tJ7', api_secret_hash: 'sk_live_****', environment: 'production', name: 'Production Key', permissions: ['payments', 'transactions'], last_used_at: '2024-02-12T16:45:00Z', is_active: true, created_at: '2024-01-12T09:45:00Z', expires_at: null },
];

export const sampleWebhooks: Webhook[] = [
  { id: 'wh1', merchant_id: '1', url: 'https://techflow.io/webhooks/payments', secret: 'whsec_****', events: ['payment.created', 'payment.updated', 'refund.created'], is_active: true, created_at: '2024-01-20T14:22:00Z' },
  { id: 'wh2', merchant_id: '5', url: 'https://digitaledge.sg/api/callbacks', secret: 'whsec_****', events: ['payment.created', 'payment.failed'], is_active: true, created_at: '2024-01-12T09:45:00Z' },
];

export const sampleReviews: ApplicationReview[] = [
  { id: 'r1', merchant_id: '1', reviewer_id: 'admin-1', review_type: 'initial_review', notes: 'All documents present and valid. Company in good standing.', decision: 'approved', created_at: '2024-01-16T10:00:00Z' },
  { id: 'r2', merchant_id: '1', reviewer_id: 'admin-1', review_type: 'final_approval', notes: 'Approved for production access. Low risk profile.', decision: 'approved', created_at: '2024-01-20T14:22:00Z' },
  { id: 'r3', merchant_id: '2', reviewer_id: 'admin-2', review_type: 'initial_review', notes: 'Pending identity verification for authorized representative.', decision: 'pending_more_info', created_at: '2024-02-10T11:00:00Z' },
  { id: 'r4', merchant_id: '4', reviewer_id: 'admin-1', review_type: 'kyc_review', notes: 'Business registration document expired. Additional due diligence required for high-risk industry.', decision: 'rejected', created_at: '2024-01-25T16:00:00Z' },
];

export const sampleActivityLog: ActivityLog[] = [
  { id: 'act1', merchant_id: '1', action: 'application_submitted', entity_type: 'merchant', entity_id: '1', details: { status: 'pending' }, ip_address: '192.168.1.1', user_agent: 'Mozilla/5.0', created_at: '2024-01-15T10:30:00Z' },
  { id: 'act2', merchant_id: '1', action: 'document_uploaded', entity_type: 'kyc_document', entity_id: 'd1', details: { document_type: 'business_registration' }, ip_address: '192.168.1.1', user_agent: 'Mozilla/5.0', created_at: '2024-01-15T10:35:00Z' },
  { id: 'act3', merchant_id: '1', action: 'document_verified', entity_type: 'kyc_document', entity_id: 'd1', details: { verified_by: 'admin-1' }, ip_address: '10.0.0.1', user_agent: 'AdminPanel/1.0', created_at: '2024-01-16T09:00:00Z' },
  { id: 'act4', merchant_id: '2', action: 'application_submitted', entity_type: 'merchant', entity_id: '2', details: { status: 'pending' }, ip_address: '192.168.1.2', user_agent: 'Mozilla/5.0', created_at: '2024-02-01T09:15:00Z' },
  { id: 'act5', merchant_id: '1', action: 'api_key_generated', entity_type: 'api_credential', entity_id: 'api1', details: { environment: 'production' }, ip_address: '10.0.0.1', user_agent: 'AdminPanel/1.0', created_at: '2024-01-20T14:22:00Z' },
];

// Aggregated merchant data for views
export interface MerchantWithDetails extends Merchant {
  contacts?: MerchantContact[];
  addresses?: MerchantAddress[];
  banking?: MerchantBanking[];
  kycDocuments?: KYCDocument[];
  kycMilestones?: KYCMilestone[];
  apiCredentials?: APICredential[];
  webhooks?: Webhook[];
  reviews?: ApplicationReview[];
}

export function getMerchantWithDetails(merchantId: string): MerchantWithDetails | undefined {
  const merchant = sampleMerchants.find(m => m.id === merchantId);
  if (!merchant) return undefined;

  return {
    ...merchant,
    contacts: sampleContacts.filter(c => c.merchant_id === merchantId),
    addresses: sampleAddresses.filter(a => a.merchant_id === merchantId),
    banking: sampleBanking.filter(b => b.merchant_id === merchantId),
    kycDocuments: sampleKYCDocuments.filter(d => d.merchant_id === merchantId),
    kycMilestones: sampleKYCMilestones.filter(m => m.merchant_id === merchantId),
    apiCredentials: sampleAPICredentials.filter(a => a.merchant_id === merchantId),
    webhooks: sampleWebhooks.filter(w => w.merchant_id === merchantId),
    reviews: sampleReviews.filter(r => r.merchant_id === merchantId),
  };
}

export function getAllMerchantsWithDetails(): MerchantWithDetails[] {
  return sampleMerchants.map(m => getMerchantWithDetails(m.id)!);
}

// Dashboard statistics
export function getDashboardStats() {
  const total = sampleMerchants.length;
  const pending = sampleMerchants.filter(m => m.status === 'pending').length;
  const underReview = sampleMerchants.filter(m => m.status === 'under_review').length;
  const approved = sampleMerchants.filter(m => m.status === 'approved').length;
  const rejected = sampleMerchants.filter(m => m.status === 'rejected').length;
  const highRisk = sampleMerchants.filter(m => m.risk_level === 'high').length;

  const thisMonth = sampleMerchants.filter(m => {
    const date = new Date(m.created_at);
    return date.getMonth() === new Date().getMonth();
  }).length;

  return {
    totalMerchants: total,
    pendingApplications: pending,
    underReview,
    approved,
    rejected,
    highRiskMerchants: highRisk,
    newThisMonth: thisMonth,
    approvalRate: Math.round((approved / (approved + rejected)) * 100),
    avgProcessingDays: 4.2,
  };
}
