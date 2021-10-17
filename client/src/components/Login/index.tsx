import './Login.scss';
import { useState, SyntheticEvent, Fragment } from 'react';
import {
	signUp,
	signIn,
	LoginOption,
	LoginState,
	usernameRegex,
} from './utils';
import { DisplayLoginState } from './DisplayLoginState';
import { DisplayLoginOption } from './DisplayLoginOption';
import { useClient, Client } from '../../providers/ClientProvider';

export const Login = () => {
	const [loginOption, setLoginOption] = useState<LoginOption>(
		LoginOption.Unselected,
	);
	const [loginState, setLoginState] = useState<LoginState>(
		LoginState.NotLogged,
	);
	const { setClient } = useClient();
	const selectSignUp = () => setLoginOption(LoginOption.SignUp);
	const selectSignIn = () => setLoginOption(LoginOption.SignIn);
	const switchLoginOption = () => {
		if (loginOption === LoginOption.SignIn) selectSignUp();
		if (loginOption === LoginOption.SignUp) selectSignIn();
		setLoginState(LoginState.NotLogged);
	};
	const isValidSignUpData = ({
		username,
		nickname,
	}: {
		username: string;
		nickname: string;
	}): boolean => {
		if (
			!usernameRegex.test(username) ||
			nickname.length < 1 ||
			nickname.length > 20
		) {
			setLoginState(LoginState.Failed_UnfulfilledRequirements);
			return false;
		}
		if (
			username.replaceAll(' ', '').toUpperCase() ===
			nickname.replaceAll(' ', '').toUpperCase()
		) {
			setLoginState(LoginState.Failed_RepeatedData);
			return false;
		}
		return true;
	};
	const handleSubmit = (event: SyntheticEvent) => {
		setLoginState(LoginState.Loading);
		event.preventDefault();
		const { nickname, username } = event.target as typeof event.target & {
			username: {
				value: string;
			};
			nickname: {
				value: string;
			};
		};

		if (loginOption === LoginOption.SignUp) {
			if (
				isValidSignUpData({
					username: username.value,
					nickname: nickname.value,
				})
			) {
				signUp({ username: username.value, nickname: nickname.value })
					.then((response) => {
						if (response.status === 201) {
							setLoginState(LoginState.Succeed_SignUp);
						}
					})
					.catch((error) => {
						if (error.response.status === 400) {
							setLoginState(LoginState.Failed_ExistingAccount);
						} else if (error.response.status === 409) {
							setLoginState(LoginState.Failed_RepeatedData);
						} else if (error.response.status === 503) {
							setLoginState(LoginState.Failed_NoService);
						}
					});
			}
		}
		if (loginOption === LoginOption.SignIn) {
			signIn(username.value)
				.then((response) => {
					const { username, ...client } =
						response.data as typeof response.data & Client;
					setClient(client);
					if (response.status === 200) {
						setLoginState(LoginState.Succeed_SignIn);
					}
				})
				.catch((error) => {
					if (error.response.status === 404) {
						setLoginState(LoginState.Failed_NonExistingAccount);
					} else if (error.response.status === 503) {
						setLoginState(LoginState.Failed_NoService);
					}
				});
		}
		if (nickname) nickname.value = '';
		if (username) username.value = '';
	};

	if (loginOption === LoginOption.Unselected)
		return (
			<div className="Login_select-container">
				<button onClick={selectSignUp}>Sign Up</button>
				<span>or</span>
				<button onClick={selectSignIn}>Sign In</button>
			</div>
		);
	else
		return (
			<Fragment>
				<DisplayLoginOption
					handleSubmit={handleSubmit}
					switchLoginOption={switchLoginOption}
					loginOptionSelected={loginOption}
				/>
				<DisplayLoginState state={loginState} />
			</Fragment>
		);
};
