import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Merchant {
  id: string;
  company_name: string;
  trading_name: string | null;
  registration_number: string | null;
  tax_id: string | null;
  business_type: string;
  industry: string | null;
  website: string | null;
  description: string | null;
  founded_year: number | null;
  employee_count: number | null;
  annual_revenue_range: string | null;
  status: 'draft' | 'pending' | 'under_review' | 'approved' | 'rejected' | 'suspended';
  risk_level: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  approved_by: string | null;
}

export interface MerchantContact {
  id: string;
  merchant_id: string;
  contact_type: 'primary' | 'billing' | 'technical' | 'legal';
  name: string;
  email: string;
  phone: string | null;
  position: string | null;
  is_primary: boolean;
  created_at: string;
}

export interface MerchantAddress {
  id: string;
  merchant_id: string;
  address_type: 'registered' | 'operational' | 'billing';
  street_address: string;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  is_primary: boolean;
  created_at: string;
}

export interface MerchantBanking {
  id: string;
  merchant_id: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  routing_number: string | null;
  swift_code: string | null;
  currency: string;
  account_type: 'checking' | 'savings';
  is_primary: boolean;
  verified: boolean;
  created_at: string;
}

export interface KYCDocument {
  id: string;
  merchant_id: string;
  document_type: 'business_registration' | 'tax_certificate' | 'id_document' | 'proof_of_address' | 'bank_statement' | 'financial_statement' | 'other';
  document_name: string;
  file_url: string;
  file_size: number | null;
  file_type: string | null;
  status: 'pending' | 'verified' | 'rejected';
  rejection_reason: string | null;
  uploaded_at: string;
  verified_at: string | null;
  verified_by: string | null;
  notes: string | null;
}

export interface KYCMilestone {
  id: string;
  merchant_id: string;
  milestone_type: string;
  title: string;
  description: string | null;
  required: boolean;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface APICredential {
  id: string;
  merchant_id: string;
  api_key: string;
  api_secret_hash: string;
  environment: 'sandbox' | 'production';
  name: string;
  permissions: string[];
  last_used_at: string | null;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

export interface Webhook {
  id: string;
  merchant_id: string;
  url: string;
  secret: string | null;
  events: string[];
  is_active: boolean;
  created_at: string;
}

export interface ApplicationReview {
  id: string;
  merchant_id: string;
  reviewer_id: string | null;
  review_type: 'initial_review' | 'kyc_review' | 'risk_assessment' | 'final_approval' | 'rejection';
  notes: string | null;
  decision: 'approved' | 'rejected' | 'pending_more_info' | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  merchant_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Json | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
