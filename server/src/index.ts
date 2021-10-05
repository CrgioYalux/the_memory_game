import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')));

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
