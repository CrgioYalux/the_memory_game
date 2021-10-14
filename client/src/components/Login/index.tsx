import './Login.scss';
import { useState } from 'react';
import {
	signUp,
	signIn,
	LoginOption,
	LoginState,
	evalInputRegex,
} from './utils';

export const Login = () => {
	const [loginOption, setLoginOption] = useState<LoginOption>(
		LoginOption.Unselected,
	);
	const [loginState, setLoginState] = useState<LoginState>(
		LoginState.NotLogged,
	);
	const [usernameInputEval, setUsernameInputEval] = useState<boolean>(false);

	const evalUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.currentTarget.value = event.currentTarget.value.replaceAll(' ', '');
		const evaluate = evalInputRegex.test(event.currentTarget.value);
		if (evaluate !== usernameInputEval) {
			setUsernameInputEval(evaluate);
		}
	};

	const selectSignUp = () => setLoginOption(LoginOption.SignUp);
	const selectSignIn = () => setLoginOption(LoginOption.SignIn);
	const switchLoginOption = () => {
		if (loginOption === LoginOption.SignIn) selectSignUp();
		if (loginOption === LoginOption.SignUp) selectSignIn();
		setLoginState(LoginState.NotLogged);
	};

	const handleSubmit = (event: React.SyntheticEvent) => {
		setLoginState(LoginState.Loading);
		event.preventDefault();
		if (loginOption === LoginOption.SignUp) {
			signUp(event)
				?.then((response) => {
					if (response.status === 201) {
						setLoginState(LoginState.Succeed_SignUp);
					}
				})
				.catch((error) => {
					if (error.response.status === 400) {
						setLoginState(LoginState.Failed_ExistingAccount);
					} else if (error.response.status === 503) {
						setLoginState(LoginState.Failed_NoService);
					}
				});
		}
		if (loginOption === LoginOption.SignIn) {
			signIn(event)
				?.then((response) => {
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
	};

	if (loginOption === LoginOption.Unselected)
		return (
			<div className="Login_select-container">
				<button onClick={selectSignUp}>Sign Up</button>
				<span>or</span>
				<button onClick={selectSignIn}>Sign In</button>
			</div>
		);
	else if (loginOption === LoginOption.SignIn)
		return (
			<>
				<form className="Login_SignIn-container" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="username">username</label>
						<input
							type="text"
							name="username"
							id="username"
							autoFocus
							required
						/>
					</div>
					<button type="submit">start playing!</button>
					<span>
						or <button onClick={switchLoginOption}>create an account</button>
					</span>
				</form>
				{loginState !== LoginState.NotLogged && (
					<span className="Login_State">
						<strong>{loginState}</strong>
					</span>
				)}
			</>
		);
	else
		return (
			<>
				<form className="Login_SignUp-container" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="username">username</label>
						<input
							onChange={evalUsername}
							minLength={7}
							maxLength={10}
							type="text"
							name="username"
							id="username"
							className={`${usernameInputEval ? '_valid' : '_unvalid'}`}
							autoFocus
							required
						/>
					</div>
					<div>
						<label htmlFor="nickname">nickname</label>

						<input
							maxLength={20}
							type="text"
							name="nickname"
							id="nickname"
							required
						/>
					</div>
					<button type="submit">Use this</button>
					<span>
						or{' '}
						<button onClick={switchLoginOption}>use an existing account</button>
					</span>
				</form>
				{loginState !== LoginState.NotLogged && (
					<span className="Login_State">
						<strong>{loginState}</strong>
					</span>
				)}
			</>
		);
};
