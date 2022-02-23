import mongoose from 'mongoose';
import configs from './db.configs';

const connectionString = configs.MONGO_DB_URI || '';

mongoose.connect(connectionString);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'))