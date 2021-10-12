import { Request, Response, NextFunction } from 'express';
import { ScoreModel } from '../mongodb/model/score';

export const signUp = (request: Request, response: Response) => {
	const data = request.body as {
		username?: string;
		nickname?: string;
	};

	if (data.username && data.nickname && !response.locals.foundUser) {
		return new ScoreModel({
			player: {
				username: data.username,
				nickname: data.nickname,
			},
			game: {
				points: 0,
				time: '--:--:--',
			},
			updatedAt: new Date(),
		})
			.save()
			.then((result) => {
				response.status(201).send(result);
			})
			.catch((error) => {
				response.status(503).send({ error });
			});
	} else {
		response.status(400).end();
	}
};

export const signIn = (request: Request, response: Response) => {
	if (response.locals.foundUser) {
		response.status(200).json(response.locals.foundUser);
	} else {
		response.status(404).end();
	}
};

export const authUser = (
	request: Request,
	response: Response,
	next: NextFunction,
) => {
	const data = request.body as { username: string };
	if (data.username) {
		ScoreModel.findOne({ 'player.username': data.username })
			.then((result) => {
				response.locals.foundUser = result;
				next();
			})
			.catch(() => {
				response.status(503).end();
			});
	}
};
