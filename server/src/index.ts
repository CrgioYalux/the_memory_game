import http from 'http';
import { connectToDB } from './mongodb/controller/connection';
import { app } from './api/app';

const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

connectToDB()
	.then(() => {
		console.log('Connected to mongoDB');
		server.listen(PORT, () => {
			console.log(`Listening on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error(`Unable to connect to DB: ${error}`);
	});
