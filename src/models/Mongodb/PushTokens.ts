import { Schema, model } from 'mongoose';
import { v4 } from 'uuid'; 
interface ITokens {
    id: string;
    user_id: string;
    token: string;
}

const schema = new Schema<ITokens>({
    id: {
        type: String,
        required: true,
        default: v4()
    },
    user_id: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
})
 
const PushToken = model<ITokens>('PushTokens', schema);

export default PushToken;