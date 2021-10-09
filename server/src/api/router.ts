import { Express } from 'express';
import { Route } from './routes';
import { signIn, signUp, authUser } from './services';
import {
	deleteScore,
	getAllScores,
	updateScore,
} from '../mongodb/controller/services';

export const router = (app: Express) => {
	app.post(Route.SIGNUP, authUser, signUp);
	app.post(Route.SIGNIN, authUser, signIn);

	app.get(Route.GET_ALL, getAllScores);
	app.delete(Route.DELETE, authUser, deleteScore);
	app.put(Route.UPDATE, authUser, updateScore);

	app.all('*', (_, response) => {
		response.status(404).end('Page not found');
	});
};
