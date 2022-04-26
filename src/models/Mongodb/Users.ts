import { Schema, model } from 'mongoose';
interface IUser {
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
    token: string;
}

const schema = new Schema<IUser>({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
        default: 'profile.png'
    },
    token: {
        type: String,
        required: true,
    }
})

const UserModel = model<IUser>('Users', schema);

export default UserModel;