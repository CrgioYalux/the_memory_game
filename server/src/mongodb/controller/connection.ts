import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

const pathToEnv = path.join(__dirname, '..', '..', '..', '..', '.env');
const env = dotenv.config({ path: pathToEnv }).parsed as {
	CONNECTION_STRING: string;
};

export const connectToDB = () => mongoose.connect(env.CONNECTION_STRING);
