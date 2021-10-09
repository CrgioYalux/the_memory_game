import { ScoreModel, Score } from '../model/score';
import { Response, Request } from 'express';
import { Document } from 'mongoose';

export const getAllScores = (request: Request, response: Response) => {
	ScoreModel.find({})
		.then((results) => {
			response.status(200).json(
				results.map((result) => {
					return {
						player: {
							nickname: result.player.nickname,
						},
						game: {
							points: result.game.points,
							time: result.game.time,
						},
						id: result.id,
						updatedAt: result.updatedAt,
					};
				}),
			);
		})
		.catch((error) => {
			response.status(503).send({ error });
		});
};

export const deleteScore = (request: Request, response: Response) => {
	if (response.locals.foundUser) {
		const { foundUser } = response.locals as {
			foundUser: Document<any, any, Score> & Score;
		};
		ScoreModel.findOneAndDelete({
			'player.username': foundUser.player.username,
		})
			.then((result) => {
				if (result) {
					return response.status(200).end();
				}
			})
			.catch((error) => {
				return response.status(503).send({ error });
			});
	} else {
		response.status(404).end();
	}
};

export const updateScore = (request: Request, response: Response) => {
	if (response.locals.foundUser) {
		const { foundUser } = response.locals as {
			foundUser: Document<any, any, Score> & Score;
		};

		const score = request.body as {
			points?: number;
			time?: string;
		};
		if (score.points) {
			foundUser.game.points = score.points;
		}
		if (score.time) {
			foundUser.game.time = score.time;
		}
		foundUser.updatedAt = new Date();

		foundUser
			.save()
			.then(() => {
				return response.status(200).end();
			})
			.catch((error) => {
				return response.status(503).send({ error });
			});
	} else {
		response.status(404).end();
	}
};
