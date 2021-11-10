import { useState, useEffect, useRef } from 'react';
import { secondsToTime, Time, timeToSeconds } from './time';

export interface useTimerProps {
	from?: Time;
	to?: Time;
	autostart?: boolean;
}

export interface useTimerValues {
	timer: Time;
	stopTimer: () => void;
	startTimer: () => void;
	restartTimer: () => void;
	addTimeOnRunning: (add: number) => void;
	isTimerRunning: boolean;
}

const defaultTime = {
	from: {
		minutes: 0,
		seconds: 0,
	},
	to: {
		minutes: Number.POSITIVE_INFINITY,
		seconds: 0,
	},
};

export const useTimer = ({
	from = defaultTime.from,
	to = defaultTime.to,
	autostart = false,
}: useTimerProps): useTimerValues => {
	const [seconds, setSeconds] = useState(from.seconds);
	const [minutes, setMinutes] = useState(from.minutes);
	const [counterRunning, setCounterRunning] = useState(false);

	const counterRef = useRef<NodeJS.Timeout>();

	const stopCounting = (): void => {
		counterRef.current && clearTimeout(counterRef.current);
		setCounterRunning(false);
	};

	const startCounting = (): void => {
		setCounterRunning(true);
	};

	const restartCounting = (): void => {
		stopCounting();
		setSeconds(0);
		setMinutes(0);
	};

	const addTimeOnRunning = (add: number): void => {
		const actualTimeInSeconds = timeToSeconds({ minutes, seconds });
		const updatedTime = secondsToTime(actualTimeInSeconds + add);
		setSeconds(updatedTime.seconds);
		setMinutes(updatedTime.minutes);
	};

	useEffect(() => {
		if (autostart) startCounting();
		return () => stopCounting();
	}, [autostart]);

	useEffect(() => {
		if (counterRunning) {
			counterRef.current && clearTimeout(counterRef.current);
			counterRef.current = setTimeout(() => {
				let prevSeconds = seconds;
				setSeconds((s) => (s === 59 ? 0 : s + 1));
				if (prevSeconds === 59) {
					setMinutes((m) => m + 1);
				}
			}, 1000);
		}
	}, [counterRunning, seconds]);

	useEffect(() => {
		if (seconds === to.seconds && minutes === to.minutes) {
			stopCounting();
		}
	}, [seconds, minutes, to]);

	return {
		timer: { seconds, minutes },
		stopTimer: stopCounting,
		startTimer: startCounting,
		restartTimer: restartCounting,
		addTimeOnRunning,
		isTimerRunning: counterRunning,
	};
};
