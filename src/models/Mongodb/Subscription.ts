import { Schema , model} from "mongoose";
import { TransactionData } from '../../interface/Transaction-interface'

const schema = new Schema<TransactionData>({
    amount: {
        type: Number,
        required: false
    },
    currency: {
        required: false,
        type: String
    },
    transaction_date: {
        required: false,
        type: String
    },
    status: {
        required: false,
        type: String
    },
    reference: {
        required: false,
        type: String
    },
    domain: {
        required: false,
        type: String
    },
    metadata: {
        required: false,
        type: Number
    },
    gateway_response: {
        type: String,
        required: false,
    },
    message: {
        type: String,
        required: false,
    },
    channel: {
        type: String,
        required: false,
    },
    ip_address: {
        type: String,
        required: false,
    },
    log: Schema.Types.Mixed,
    fees: {
        type: String,
        required: false,
    },
    authorization: Schema.Types.Mixed,
    customer: Schema.Types.Mixed,
    plan: {
        type: String,
        required: false,
    },
    requested_amount: {
        type: Number,
        required: false,
    },
})

export default model<TransactionData>('Subscription', schema)