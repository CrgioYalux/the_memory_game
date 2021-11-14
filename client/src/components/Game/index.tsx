import './Game.scss';
import { useState, useEffect, useRef } from 'react';
import { useTimer } from '../../hooks/useTime';
import { Time } from '../../hooks/useTime/time';
import { Board } from './Board';
import { createBoard, BoardPiece } from './utils';
import { GameStates } from './utils';
import { Info } from './Info';
import { GameResult } from './utils';
import { formatTime } from '../../hooks/useTime/time';
interface GameProps {
	difficulty: number;
	time: Time | string;
	setGameResults: React.Dispatch<React.SetStateAction<GameResult | null>>;
}

export const Game = ({ difficulty, time, setGameResults }: GameProps) => {
	const [board, setBoard] = useState<BoardPiece[][]>(() =>
		createBoard(difficulty),
	);
	const [wins, setWins] = useState<number>(0);
	const [losses, setLosses] = useState<number>(0);
	const [boardVisibility, setBoardVisibilty] = useState<boolean>(true);
	const [completed, setCompleted] = useState<string[]>([]);
	const [selected, setSelected] = useState<BoardPiece[]>([]);
	const [pairs, setPairs] = useState<BoardPiece[][]>([]);
	const [gameState, setGameState] = useState<GameStates>(GameStates.NotPlaying);
	const [cssBasedOnGameState, setCssBasedOnGameState] = useState<string>('');
	const { timer, isTimerRunning, addTimeOnRunning, stopTimer, startTimer } =
		useTimer(
			typeof time !== 'string'
				? {
						to: time,
						autostart: false,
				  }
				: {
						autostart: false,
				  },
		);
	const hideAfterSelectionRef = useRef<NodeJS.Timeout>(setTimeout(() => {}, 0));

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
		return new Promise((resolve, _) => {
			let hide = setTimeout(() => {
				setBoardVisibilty(false);
				resolve(true);
			}, 1000 * timeInSeconds);
			return () => clearTimeout(hide);
		});
	};

	const restartRound = (gameState: GameStates) => {
		setPairs([]);
		setSelected([]);
		setCompleted([]);
		setBoard(createBoard(difficulty));
		setBoardVisibilty(true);
		let keepRunning = true;
		if (gameState === GameStates.Lose) {
			if (typeof time !== 'string') {
				keepRunning = addTimeOnRunning(difficulty);
			}
			setLosses(losses + 1);
		} else if (gameState === GameStates.Win) {
			if (typeof time !== 'string') {
				keepRunning = addTimeOnRunning((difficulty + difficulty) * -1);
			}
			setWins(wins + 1);
		}
		setGameState(GameStates.Playing);
		keepRunning && hideBoardAfterTheTime(difficulty);
	};

	useEffect(() => {
		hideBoardAfterTheTime(difficulty).then(() => {
			startTimer();
			setGameState(GameStates.Playing);
		});
	}, []);

	useEffect(() => {
		if (completed.length === (difficulty * difficulty - 1) / 2) {
			restartRound(GameStates.Win);
		}
	}, [completed]);

	useEffect(() => {
		if (isTimerRunning === false && gameState === GameStates.Playing) {
			clearTimeout(hideAfterSelectionRef.current);
			setBoardVisibilty(false);
			switchAllPiecesVisibility(true);
			let result;
			if (wins > losses) {
				result = GameStates.Win;
				setGameState(GameStates.Win);
			}
			if (wins < losses) {
				result = GameStates.Lose;
				setGameState(GameStates.Lose);
			}
			if (wins === losses) {
				result = GameStates.Tie;
				setGameState(GameStates.Tie);
			}
			setGameResults({
				result: result as GameStates,
				wins: wins - losses,
				time:
					typeof time === 'string'
						? `${formatTime(timer)} (custom)`
						: formatTime(time),
				difficulty,
			});
		}
	}, [isTimerRunning]);

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
		if (selected.length !== 0 && gameState === GameStates.Playing) {
			hideAfterSelectionRef.current = setTimeout(() => {
				switchAllPiecesVisibility(false);
				setSelected([]);
				setPairs([]);
			}, 1000);
			return () => clearTimeout(hideAfterSelectionRef.current);
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
			<Info
				wins={wins}
				time={time}
				timer={timer}
				losses={losses}
				stopTimer={stopTimer}
				gameState={gameState}
				difficulty={difficulty}
				cssBasedOnGameState={cssBasedOnGameState}
			/>
			<Board
				board={board}
				select={select}
				completed={completed}
				boardVisibility={boardVisibility}
			/>
		</div>
	);
};
