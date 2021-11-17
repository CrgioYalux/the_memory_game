import './Scoreboard.scss';
import { useFetch } from '../../hooks/useFetch';
import { Score, formatDayMonthYear } from './utils';
import { useClient } from '../../providers/ClientProvider';

interface ScoreboardProps {}

export const Scoreboard = ({}: ScoreboardProps) => {
	const { client } = useClient();

	const {
		data: scores,
		loading,
		error,
	} = useFetch<Score>({ url: '../api/scores' });

	if (loading) {
		return <h3 className="Scoreboard-message">Loading...</h3>;
	}

	if (error) {
		return (
			<h3 className="Scoreboard-message">
				Unable to get the scoreboard data. Please, try later.
			</h3>
		);
	}

	if (scores.length === 0) {
		return (
			<h3 className="Scoreboard-message">
				There's no data on the scoreboard yet. Be the first to have your name on
				top.
			</h3>
		);
	}

	return (
		<table className="Scoreboard-container">
			<thead>
				<tr>
					<th>Nickname</th>
					<th>Difficulty</th>
					<th>Points</th>
					<th>Time</th>
					<th>Last time updated</th>
				</tr>
			</thead>
			<tbody>
				{client && (
					<tr key="client" className="is_client">
						<td>{client.player.nickname}</td>
						<td>{client.game.difficulty}</td>
						<td>{client.game.points}</td>
						<td>{client.game.time}</td>
						<td>{formatDayMonthYear(client.updatedAt)}</td>
					</tr>
				)}
				{scores
					.filter((score) => score.id !== client?.id)
					.map((score) => {
						return (
							<tr key={score.id}>
								<td>{score.player.nickname}</td>
								<td>{score.game.difficulty}</td>
								<td>{score.game.points}</td>
								<td>{score.game.time}</td>
								<td>{formatDayMonthYear(score.updatedAt)}</td>
							</tr>
						);
					})}
			</tbody>
		</table>
	);
};
