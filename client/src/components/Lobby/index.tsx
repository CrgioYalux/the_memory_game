import './Lobby.scss';
import { useState, useEffect } from 'react';
import { usePanel } from '../../providers/PanelProvider';
import { useClient } from '../../providers/ClientProvider';
import { formatTime } from '../../hooks/useTime/time';
import { Game } from '../Game';
import { Time } from '../../hooks/useTime/time';
import { GameResult } from '../Game/utils';
import { sendGameResults } from './utils';

interface GameProps {}

const timeOptions: Time[] = [
	{ minutes: 0, seconds: 30 },
	{ minutes: 1, seconds: 0 },
	{ minutes: 1, seconds: 30 },
];
const difficultyOptions = [
	{ difficulty: 3 },
	{ difficulty: 5 },
	{ difficulty: 7 },
];

export const Lobby = ({}: GameProps) => {
	const { goToBase } = usePanel();
	const { logged, client } = useClient();
	const [difficulty, setDifficulty] = useState<number>(
		difficultyOptions[0].difficulty,
	);
	const [time, setTime] = useState<Time | string>(timeOptions[0]);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [gameResults, setGameResults] = useState<GameResult | null>(null);

	const goBackToLobby = () => {
		setIsPlaying(false);
	};

	useEffect(() => {
		if (gameResults && client) {
			sendGameResults({
				url: '../api/scores',
				username: client.player.username,
				points: gameResults.wins,
				time: gameResults.time,
				difficulty: gameResults.difficulty,
			});
		}
	}, [gameResults]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsPlaying(true);
	};

	if (isPlaying) {
		return (
			<Game
				difficulty={difficulty}
				time={time}
				setGameResults={setGameResults}
				goBackToLobby={goBackToLobby}
			/>
		);
	}

	if (!logged) {
		return (
			<div className="Lobby-container _not_logged">
				<span>
					In order to save your progress when playing, you must use an account.
				</span>
				<span>
					Go and create yours in a second, it's not even a safe thing, you'll
					only need a username and a nickname.
				</span>
				<button onClick={goToBase}>go to login</button>
			</div>
		);
	}
	return (
		<div className="Lobby-container _logged">
			<form onSubmit={handleSubmit}>
				<div className="game-options">
					<section>
						<h3>Difficulty</h3>
						<div className="difficulty-options">
							{difficultyOptions.map(({ difficulty: d }, idx) => {
								return (
									<div key={idx} className="difficulty-option">
										<input
											type="radio"
											name="difficulty-option"
											id={`difficulty-option-${idx}`}
											value={difficulty}
											onChange={() => setDifficulty(d)}
											checked={d === difficulty}
										/>
										<label
											htmlFor={`difficulty-option-${idx}`}
										>{`${d}X${d}`}</label>
									</div>
								);
							})}
						</div>
					</section>
					<section>
						<h3>Time</h3>
						<div className="time-options">
							{timeOptions.map((t, idx) => {
								return (
									<div key={idx} className="time-option _normal">
										<input
											type="radio"
											name="time-option"
											id={`time-option-${idx}`}
											onChange={() => setTime(t)}
											value={JSON.stringify(t)}
											checked={
												typeof time === 'object' &&
												t.seconds === time.seconds &&
												t.minutes === time.minutes
											}
										/>
										<label htmlFor={`time-option-${idx}`}>
											{formatTime(t)}
										</label>
									</div>
								);
							})}
							<div className="time-option _custom">
								<input
									type="radio"
									name="time-option"
									id="time-option-custom"
									value="custom"
									onChange={() => setTime('custom')}
									checked={time === 'custom'}
								/>
								<label htmlFor="time-option-custom">custom</label>
							</div>
						</div>
					</section>
				</div>
				<button type="submit">Play</button>
			</form>
		</div>
	);
};
