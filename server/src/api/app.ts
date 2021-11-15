import express from 'express';
import cors from 'cors';
import path from 'path';
import { router } from './router';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	'/play',
	express.static(
		path.join(__dirname, '..', '..', '..', '..', 'client', 'build'),
	),
);

router(app);
