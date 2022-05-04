export interface Customer {
  id: number;
  customer_code: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Log {
  time_spent: number;
  attempts: number;
  authentication: string;
  errors: number;
  success: boolean;
  mobile: boolean;
  input: any[];
  channel: string;
  history: { type: string; message: string; time: number }[];
}

export interface Authorization {
  authorization_code: string;
  card_type: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  bin: string;
  bank: string;
  channel: string;
  signature: string;
  reusable: true;
  country_code: string;
  account_name: string;
}

export interface TransactionData {
  amount: number;
  currency: string;
  transaction_date: string;
  status: string;
  reference: string;
  domain: string;
  metadata: number;
  gateway_response: string;
  message: string;
  channel: string;
  ip_address: string;
  log: Log;
  fees: string;
  authorization: Authorization;
  customer: Customer;
  plan: string;
  requested_amount: number;
}

export interface Transaction {
  status: boolean;
  message: string;
  data: TransactionData;
}

