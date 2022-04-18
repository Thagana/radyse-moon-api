import { Schema, model } from 'mongoose';
import { v4 } from 'uuid'; 

interface INewsSettings {
    id: string;
    user_id: string;
    language: string;
    location: string;
    category: string;
    frequency: number;
    push_enabled: number;
    email_notification: number;
}

const schema = new Schema<INewsSettings>({
    id: {
        type: String,
        required: true,
        default: v4()
    },
    user_id: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    frequency: {
        type: Number,
        required: true,
    },
    email_notification: {
        type: Number,
        required: true,
    },
    push_enabled: {
        type: Number,
        required: true,
    },
})
 
const NewsSettings = model<INewsSettings>('NewsSettings', schema);

export default NewsSettings;