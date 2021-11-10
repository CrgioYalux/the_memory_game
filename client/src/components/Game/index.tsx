import './Game.scss';

import { useState, useEffect } from 'react';
import { useTimer } from '../../hooks/useTime';
import { Time, formatTime } from '../../hooks/useTime/time';
import { Board } from './Board';
import { createBoard, BoardPiece } from './utils';
import { subtractTwoTimes } from '../../hooks/useTime/time';

interface GameProps {
	difficulty: number;
	time: Time | string;
}

enum GameStates {
	Playing = 'PLAYING',
	Lose = 'LOSE',
	Win = 'WIN',
	Tie = 'TIE',
}

export const Game = ({ difficulty, time }: GameProps) => {
	const [wins, setWins] = useState<number>(0);
	const [losses, setLosses] = useState<number>(0);
	const [boardVisibility, setBoardVisibilty] = useState<boolean>(true);
	const [board, setBoard] = useState<BoardPiece[][]>(() =>
		createBoard(difficulty),
	);
	const [completed, setCompleted] = useState<string[]>([]);
	const [selected, setSelected] = useState<BoardPiece[]>([]);
	const [pairs, setPairs] = useState<BoardPiece[][]>([]);
	const [gameState, setGameState] = useState<GameStates>(GameStates.Playing);
	const [cssBasedOnGameState, setCssBasedOnGameState] = useState<string>('');
	const { isTimerRunning, timer, addTimeOnRunning, stopTimer } = useTimer(
		typeof time !== 'string'
			? {
					to: time,
					autostart: true,
			  }
			: {
					autostart: true,
			  },
	);

	const select = (thisPiece: BoardPiece) => {
		setSelected((prev) => {
			const alreadyIn =
				prev.filter((piece) => piece.id === thisPiece.id).length === 1;
			if (alreadyIn) return prev;
			else return [...prev, thisPiece];
		});
		switchPieceVisibility(thisPiece);
	};

	const switchAllPiecesVisibility = (visibility: boolean) => {
		setBoard((prev) => {
			return prev.map((row) => {
				return row.map((piece) => {
					piece.value.visibility = visibility;
					return piece;
				});
			});
		});
	};

	const addPair = (pieceA: BoardPiece, pieceB: BoardPiece) => {
		setPairs((prev) => [...prev, [pieceA, pieceB]]);
	};

	const switchPieceVisibility = (thisPiece: BoardPiece) => {
		setBoard((prev) => {
			return prev.map((row) => {
				return row.map((piece) => {
					if (piece.id === thisPiece.id)
						piece.value.visibility = !piece.value.visibility;
					return piece;
				});
			});
		});
	};

	const hideBoardAfterTheTime = (timeInSeconds: number) => {
		const hide = setTimeout(() => {
			setBoardVisibilty(false);
		}, 1000 * timeInSeconds);
		return () => clearTimeout(hide);
	};

	const restartRound = (gameState: GameStates) => {
		setPairs([]);
		setSelected([]);
		setCompleted([]);
		setBoard(createBoard(difficulty));
		setBoardVisibilty(true);
		if (gameState === GameStates.Lose) {
			addTimeOnRunning(difficulty);
			setLosses(losses + 1);
		} else if (gameState === GameStates.Win) {
			addTimeOnRunning(difficulty * -1);
			setWins(wins + 1);
		}
		setGameState(GameStates.Playing);
		hideBoardAfterTheTime(difficulty);
	};

	useEffect(() => {
		if (completed.length === (difficulty * difficulty - 1) / 2) {
			restartRound(GameStates.Win);
		}
	}, [completed]);

	useEffect(() => {
		if (
			isTimerRunning !== false &&
			typeof time === 'object' &&
			timer.minutes >= time.minutes &&
			timer.seconds >= time.seconds
		) {
			if (wins > losses) setGameState(GameStates.Win);
			if (wins < losses) setGameState(GameStates.Lose);
			if (wins === losses) setGameState(GameStates.Tie);
			switchAllPiecesVisibility(true);
			stopTimer();
		}
	}, [timer]);

	useEffect(() => {
		hideBoardAfterTheTime(difficulty);
	}, []);

	useEffect(() => {
		const lose =
			selected.filter((piece) => piece.value.label === '!').length !== 0;
		if (lose) {
			restartRound(GameStates.Lose);
		} else {
			if (selected.length % 2 === 0) {
				for (let i = 0; i < selected.length; i = i + 2) {
					let first = selected[i];
					let second = selected[i + 1];
					if (second) addPair(first, second);
				}
			}
		}
	}, [selected]);

	useEffect(() => {
		if (pairs.length !== 0) {
			pairs.map((pair) => {
				const [first, second] = pair;
				if (first.value.label === second.value.label) {
					setCompleted((prev) => [...new Set([...prev, first.value.label])]);
				}
			});
		}
	}, [pairs]);

	useEffect(() => {
		if (selected.length !== 0) {
			const hide = setTimeout(() => {
				switchAllPiecesVisibility(false);
				setSelected([]);
				setPairs([]);
			}, 1000);
			return () => clearTimeout(hide);
		}
	}, [selected]);

	useEffect(() => {
		if (losses !== 0) {
			setCssBasedOnGameState('_lose');
			const setTimed = setTimeout(() => {
				setCssBasedOnGameState('');
			}, 400);
			return () => clearTimeout(setTimed);
		}
	}, [losses]);

	useEffect(() => {
		if (wins !== 0) {
			setCssBasedOnGameState('_win');
			const setTimed = setTimeout(() => {
				setCssBasedOnGameState('');
			}, 400);
			return () => clearTimeout(setTimed);
		}
	}, [wins]);

	return (
		<div className={`Game-container ${cssBasedOnGameState}`}>
			<div>
				<span className="timer">
					<strong>
						{typeof time === 'object' &&
							formatTime(subtractTwoTimes(timer, time))}
					</strong>
					{cssBasedOnGameState !== '' && (
						<small className={`additional-time ${cssBasedOnGameState}`}>
							{cssBasedOnGameState === '_win' && `+${difficulty}s`}
							{cssBasedOnGameState === '_lose' && `-${difficulty}s`}
						</small>
					)}
				</span>
				<span className="marker">
					<strong className="wins">
						<span>wins</span>
						<span>{wins}</span>
					</strong>
					<strong className="losses">
						<span>losses</span>
						<span>{losses}</span>
					</strong>
				</span>
			</div>
			<Board
				completed={completed}
				board={board}
				boardVisibility={boardVisibility}
				select={select}
			/>
		</div>
	);
};
