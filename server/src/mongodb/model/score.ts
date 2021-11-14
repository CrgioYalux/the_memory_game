import { Schema, model } from 'mongoose';

export interface Score {
	player: {
		username: string;
		nickname: string;
	};
	game: {
		difficulty: number;
		points: number;
		time: string;
	};
	updatedAt: Date;
}

const schema = new Schema<Score>({
	player: {
		username: {
			type: String,
			required: true,
		},
		nickname: {
			type: String,
			required: true,
		},
	},
	game: {
		difficulty: {
			type: Number,
			required: true,
		},
		points: {
			type: Number,
			required: true,
		},
		time: {
			type: String,
			required: true,
		},
	},
	updatedAt: {
		type: Date,
		remove: true,
	},
});

schema.set('toJSON', {
	transform: (_, returnedObject) => {
		returnedObject.id = returnedObject._id;
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

export const ScoreModel = model<Score>('Score', schema);
