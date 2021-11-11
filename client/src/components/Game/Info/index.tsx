import './Info.scss';
import {
	Time,
	formatTime,
	subtractTwoTimes,
} from '../../../hooks/useTime/time';
import { GameStates } from '../utils';
import { useState, useEffect } from 'react';

interface InfoProps {
	gameState: GameStates;
	time: Time | string;
	timer: Time;
	difficulty: number;
	wins: number;
	losses: number;
	cssBasedOnGameState: string;
	stopTimer: () => void;
}

export const Info = ({
	gameState,
	time,
	timer,
	difficulty,
	wins,
	losses,
	cssBasedOnGameState,
	stopTimer,
}: InfoProps) => {
	return (
		<div className="Info-container">
			<section className="timer">
				{typeof time !== 'string' ? (
					gameState === GameStates.Playing ? (
						<strong>
							{typeof time === 'object' &&
								formatTime(subtractTwoTimes(timer, time))}
						</strong>
					) : (
						<strong>{gameState.toLowerCase()}</strong>
					)
				) : (
					<button
						onClick={stopTimer}
						className="custom-time"
						title="Click here for ending the game"
					>
						<strong>{formatTime(timer)}</strong>
					</button>
				)}
				{typeof time !== 'string' && cssBasedOnGameState !== '' && (
					<small className={`additional-time ${cssBasedOnGameState}`}>
						{cssBasedOnGameState === '_win' && `+${difficulty}s`}
						{cssBasedOnGameState === '_lose' && `-${difficulty}s`}
					</small>
				)}
			</section>
			<section className="marker">
				<strong className="wins">
					<span>wins</span>
					<span>{wins}</span>
				</strong>
				<strong className="losses">
					<span>losses</span>
					<span>{losses}</span>
				</strong>
			</section>
		</div>
	);
};
