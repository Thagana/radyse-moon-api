import { Schema, model } from 'mongoose';

interface IUserMeta {
    browser_name: string;
    browser_version: string;
    device_type: string;
    device_vendor: string;
    device_model: string;
    os_name: string;
    os_version: string;
    engine_name: string;
    cpu_architecture: string;
}

const schema = new Schema<IUserMeta>({
    browser_name: {
        required: true,
        type: String
    },
    browser_version: {
        required: true,
        type: String
    },
    device_type: {
        required: true,
        type: String
    },
    device_vendor: {
        required: true,
        type: String
    },
    device_model: {
        required: true,
        type: String
    },
    os_name: {
        required: true,
        type: String
    },
    os_version: {
        required: true,
        type: String
    },
    engine_name: {
        required: true,
        type: String
    },
    cpu_architecture: {
        required: true,
        type: String
    },
});

export default model<IUserMeta>('UserMeta', schema);
