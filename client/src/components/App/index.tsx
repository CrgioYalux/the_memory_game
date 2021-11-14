import './App.scss';
import { Lobby } from '../Lobby';
import { Login } from '../Login';
import { PanelProvider } from '../../providers/PanelProvider';
import { Scoreboard } from '../Scoreboard';
import { ClientProvider } from '../../providers/ClientProvider';
import { Navbar } from '../Navbar';

const components = [
	{
		name: 'Lobby',
		component: <Lobby />,
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
export enum Section {
	Login = 'Login',
	Scoreboard = 'Scoreboard',
	Lobby = 'Lobby',
}

export const App = () => {
	return (
		<div className="App-container">
			<ClientProvider>
				<PanelProvider
					components={components}
					baseComponent={{
						ifLogged: Section.Scoreboard,
						ifNotLogged: Section.Login,
					}}
				>
					<Navbar components={components} />
				</PanelProvider>
			</ClientProvider>
		</div>
	);
};
