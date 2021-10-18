import './App.scss';
import { Game } from '../Game';
import { Login } from '../Login';
import { PanelProvider } from '../../providers/PanelProvider';
import { Scoreboard } from '../Scoreboard';
import { ClientProvider } from '../../providers/ClientProvider';
import { Navbar } from '../Navbar';

const components = [
	{
		name: 'Game',
		component: <Game />,
		visibility: false,
	},
	{
		name: 'Scoreboard',
		component: <Scoreboard />,
		visibility: false,
	},
	{
		name: 'Login',
		component: <Login />,
		visibility: true,
	},
];

export const App = () => {
	return (
		<div className="App-container">
			<ClientProvider>
				<PanelProvider components={components}>
					<Navbar components={components} />
				</PanelProvider>
			</ClientProvider>
		</div>
	);
};
