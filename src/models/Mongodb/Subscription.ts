import { Schema, model } from 'mongoose';

interface ISubscription {
    user_id: string;
    subscription_id: string;
    start_date: string;
    end_date: string;
    created_at: string;
    billed: string;
    state: string
}

const schema = new Schema<ISubscription>({
    user_id: {
        required: true,
        type: String,
    },
    start_date: {
        required: true,
        type: String,
    },
    end_date: {
        required: true,
        type: String,
    },
    created_at: {
        require: true,
        type: String,
    },
    state: {
        required: true,
        type: String,
    }
});

export default model<ISubscription>('Subscriptions', schema);