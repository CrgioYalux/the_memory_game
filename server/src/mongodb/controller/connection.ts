import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

const pathToEnv = path.join(__dirname, '..', '..', '..', '..', '..', '.env');
const env = dotenv.config({ path: pathToEnv }).parsed as {
	CONNECTION_STRING: string;
};

export const connectToDB = () => {
	if (process.env.CONNECTION_STRING) {
		return mongoose.connect(process.env.CONNECTION_STRING);
	} else {
		return mongoose.connect(env.CONNECTION_STRING);
	}
};
