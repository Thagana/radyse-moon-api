import { Authorization } from "./Transaction-interface";

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
