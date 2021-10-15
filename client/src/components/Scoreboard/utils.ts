export type Score = {
	player: {
		nickname: string;
	};
	game: {
		points: number;
		time: string;
	};
	id: string;
	updatedAt: Date;
};

export const formatDayMonthYear = (d: Date) => {
	const fromStringToDate = new Date(d);

	const day = fromStringToDate.getDate();
	const month = fromStringToDate.getMonth();
	const year = fromStringToDate.getFullYear();

	return `${day < 10 ? '0' + day : day}/${
		month < 10 ? '0' + month : month
	}/${year}`;
};
