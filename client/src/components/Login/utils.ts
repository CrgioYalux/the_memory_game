import { SyntheticEvent } from 'react';
import axios from 'axios';

export const signUp = (event: SyntheticEvent) => {
	const target = event.target as typeof event.target & {
		username: {
			value: string;
		};
		nickname: {
			value: string;
		};
	};

	if (target.username.value && target.nickname.value) {
		return axios.post('../auth/signup', {
			username: target.username.value,
			nickname: target.nickname.value,
		});
	}
};

export const signIn = (event: SyntheticEvent) => {
	const target = event.target as typeof event.target & {
		username: {
			value: string;
		};
	};
	if (target.username.value) {
		return axios.post('../auth/signin', {
			username: target.username.value,
		});
	}
};

export enum LoginOption {
	SignUp,
	SignIn,
	Unselected,
}

export enum LoginState {
	Failed_ExistingAccount = 'The entered username is already being used.',
	Failed_NonExistingAccount = 'The entered username does not belong to any account.',
	Failed_NoService = 'An error occurred while requesting the service. Please, try later.',
	Succeed = 'Logged in successfully.',
	Succeed_SignUp = 'Your account has been created successfully.',
	Succeed_SignIn = 'Logged in successfully.',
	NotLogged = 'Login.',
	Loading = 'Loading.',
}

export const evalInputRegex = /(^[A-Za-z][A-za-z0-9]{6,9})/;
