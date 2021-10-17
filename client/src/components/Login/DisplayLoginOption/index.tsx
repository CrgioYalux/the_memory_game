import './DisplayLoginOption.scss';
import { Fragment, useState } from 'react';
import { LoginOption, usernameRegex } from '../utils';
import { Tips } from '../Tips';

interface DisplayLoginOptionProps {
	loginOptionSelected: LoginOption;
	switchLoginOption: () => void;
	handleSubmit: (event: React.SyntheticEvent) => void;
}

export const DisplayLoginOption = ({
	loginOptionSelected,
	handleSubmit,
	switchLoginOption,
}: DisplayLoginOptionProps) => {
	const [usernameInputEval, setUsernameInputEval] = useState<boolean>(false);

	const evalUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.currentTarget.value = event.currentTarget.value.replaceAll(' ', '');
		const evaluate = usernameRegex.test(event.currentTarget.value);
		if (evaluate !== usernameInputEval) {
			setUsernameInputEval(evaluate);
		}
	};

	return (
		<Fragment>
			{loginOptionSelected === LoginOption.SignUp && (
				<Fragment>
					<Tips />
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
							<button onClick={switchLoginOption}>
								use an existing account
							</button>
						</span>
					</form>
				</Fragment>
			)}
			{loginOptionSelected === LoginOption.SignIn && (
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
			)}
		</Fragment>
	);
};
