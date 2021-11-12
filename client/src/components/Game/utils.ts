import { arrayOfLetters, shuffleArray } from '../../helpers';

export enum GameStates {
	NotPlaying = 'NOTPLAYING',
	Playing = 'PLAYING',
	Lose = 'LOSE',
	Win = 'WIN',
	Tie = 'TIE',
}

export type BoardPiece = {
	value: {
		label: string;
		visibility: boolean;
	};
	position: {
		x: number;
		y: number;
	};
	id: string;
};

export type Board = BoardPiece[][];

export const createBoard = (size: number) => {
	const labels = arrayOfLetters(size);
	const matrix = [...Array(size).keys()].map(() =>
		[...Array(size).keys()].map(() => ''),
	);
	const values = shuffleArray([...labels, ...labels, '!']);
	let index = 0;
	for (let x = 0; x < size; x++) {
		for (let y = 0; y < size; y++) {
			matrix[x][y] = values[index];
			index++;
		}
	}
	const board: Board = matrix.map((row, x) => {
		return row.map((label, y) => {
			return {
				value: {
					label,
					visibility: false,
				},
				position: {
					x,
					y,
				},
				id: `${x}/${y}`,
			};
		});
	});
	return board;
};
