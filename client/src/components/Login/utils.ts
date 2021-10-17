import axios from 'axios';

export const signUp = ({
	username,
	nickname,
}: {
	username: string;
	nickname: string;
}) => {
	return axios.post('../auth/signup', {
		username,
		nickname,
	});
};

export const signIn = (username: string) => {
	return axios.post('../auth/signin', {
		username,
	});
};

export enum LoginOption {
	SignUp,
	SignIn,
	Unselected,
}

export enum LoginState {
	Failed_UnfulfilledRequirements = 'Username must be 7-10 alphanumeric characters long and must start with a letter. Nickname must be 1-20 characterers long.',
	Failed_RepeatedData = 'Username and Nickname cannot be the same.',
	Failed_ExistingAccount = 'The entered username is already being used.',
	Failed_NonExistingAccount = 'The entered username does not belong to any account.',
	Failed_NoService = 'An error occurred while requesting the service. Please, try later.',
	Succeed = 'Logged in successfully.',
	Succeed_SignUp = 'Your account has been created successfully.',
	Succeed_SignIn = 'Logged in successfully.',
	Loading = 'Loading.',
	NotLogged = 'Login.',
}

export const usernameRegex = /(^[a-zA-Z][a-zA-z0-9]{6,9})/;
