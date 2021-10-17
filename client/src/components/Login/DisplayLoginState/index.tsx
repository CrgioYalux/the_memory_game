import './DisplayLoginState.scss';
import { LoginState } from '../utils';

interface DisplayLoginStateProps {
	state: LoginState;
}

export const DisplayLoginState = ({ state }: DisplayLoginStateProps) => {
	return state !== LoginState.NotLogged ? (
		<span className="Login_State">
			<strong>{state}</strong>
		</span>
	) : (
		<></>
	);
};
