import { Schema, model } from "mongoose";

interface IPlan {
  name: string;
  interval: string;
  amount: number;
  integration: number;
  domain: string;
  currency: string;
  plan_code: string;
  invoice_limit: number;
  send_invoices: boolean;
  send_sms: boolean;
  hosted_page: boolean;
  migrate: boolean;
  id: number;
  createdAt: string;
  updatedAt: string;
}

const schema = new Schema<IPlan>({
  name: {
    type: String,
    required: true,
  },
  interval: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  integration: {
    type: Number,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  plan_code: {
    type: String,
    required: true,
  },
  invoice_limit: {
    type: Number,
    required: true,
  },
  send_invoices: {
    type: Boolean,
    required: true,
  },
  send_sms: {
    type: Boolean,
    required: true,
  },
  hosted_page: {
    type: Boolean,
    required: true,
  },
  migrate: {
    type: Boolean,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: String,
    required: true,
  },
});

export default model<IPlan>('Plan', schema);
