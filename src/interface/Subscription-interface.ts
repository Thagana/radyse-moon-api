
export interface Subscription {
  status: boolean;
  message: string;
  data: {
    customer: number;
    plan: number;
    integration: number;
    domain: string;
    start: number;
    status: string;
    quantity: number;
    amount: number;
    authorization: Authorization;
    invoice_limit: number;
    subscription_code: string;
    email_token: string;
    id: number;
    createdAt: string;
    updatedAt: string;
    cron_expression: string;
    next_payment_date: string;
  };
}

export interface Customer {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  metadata: string;
  domain: string;
  customer_code: string;
  risk_action: string;
  id: number;
  integration: number;
  createdAt: string;
  updatedAt: string;
}
export interface Plan {
    domain: string;
    name: string;
    plan_code: string;
    description: string;
    amount: number;
    interval: string;
    send_invoices: boolean;
    send_sms: boolean;
    hosted_page: boolean;
    hosted_page_url: string;
    hosted_page_summary: string;
    currency: string;
    migrate: string;
    id: number;
    integration: number;
    createdAt: string;
    updatedAt: string;
}

export interface Authorization {
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  channel: string;
  card_type: string;
  bank: string;
  country_code: string;
  brand: string;
  reusable: boolean;
  signature: string;
  account_name: string;
}

export interface Data {
  customer: Customer;
  plan: Plan;
  integration: number;
  authorization: Authorization;
  domain: number;
  start: number;
  status: string;
  quantity: 1;
  amount: number;
  subscription_code: string;
  email_token: string;
  easy_cron_id: string;
  cron_expression: string;
  next_payment_date: string;
  open_invoice: string;
  id: number;
  createdAt: string;
  updatedAt: string;
}
export interface Subscriptions {
  status: boolean;
  message: string;
  data: Array<Data>;
  meta: {
    total: number;
    skipped: number;
    perPage: number;
    page: number;
    pageCount: number;
  };
}
