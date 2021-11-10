export const range = ({
	size,
	startAt = 0,
}: {
	size: number;
	startAt: number;
}) => {
	return [...Array(size).keys()].map((i) => i + startAt);
};

export const arrayOfLetters = (size: number) =>
	characterRange({
		startWithChar: 'A',
		endWithChar: getCharFromInt((size ** 2 - 1) / 2),
	});

export const characterRange = ({
	startWithChar,
	endWithChar,
}: {
	startWithChar: string;
	endWithChar: string;
}) => {
	return String.fromCharCode(
		...range({
			size: endWithChar.charCodeAt(0) - startWithChar.charCodeAt(0),
			startAt: startWithChar.charCodeAt(0),
		}),
	);
};

export const getCharFromInt = (int: number) => {
	return String.fromCharCode(int + 65);
};

export const shuffleArray = <T>(array: Array<T>): Array<T> => {
	let currentIndex = array.length,
		temporaryValue,
		randomIndex;

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
};
