import { Schema , model} from "mongoose";
import { SubscriptionData } from '../../../../interface/Subscription-interface'

const schema = new Schema<SubscriptionData>({
    amount: {
        type: Number,
        required: false
    },
    customer: {
        required: false,
        type: Number
    },
    plan: {
        required: false,
        type: Number
    },
    status: {
        required: false,
        type: String
    },
    id: {
        required: false,
        type: Number
    },
    domain: {
        required: false,
        type: String
    },
    integration: {
        required: false,
        type: Number
    },
    start: {
        type: Number,
        required: false,
    },
    quantity: {
        type: Number,
        required: false,
    },
    authorization: {
        type: Schema.Types.Mixed,
        required: false,
    },
    invoice_limit: {
        type: Number,
        required: false,
    },
    cron_expression: {
        type: String,
        required: true
    },
    updatedAt: {
        type: String,
        required: false,
    },
    createdAt: {
        type: String,
        required: false,
    },
    next_payment_date: {
        type: String,
        required: false
    },
    email_token: {
        type: String,
        required: true
    },
    subscription_code: {
        type: String,
        required: false,
    },
    user_id: {
        required: true,
        type: String
    }
})

export default model<SubscriptionData>('Subscription', schema);