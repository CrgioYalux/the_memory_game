import axios from 'axios';

export const sendGameResults = ({
	url,
	username,
	points,
	time,
	difficulty,
}: {
	url: string;
	username: string;
	points: number;
	time: string;
	difficulty: number;
}) => {
	return axios.put(url, {
		username,
		points,
		time,
		difficulty,
	});
};
