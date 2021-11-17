import { createContext, useContext, useState } from 'react';

export type Client = {
	player: {
		username: string;
		nickname: string;
	};
	game: {
		points: number;
		time: string;
		difficulty: number;
	};
	id: string;
	updatedAt: Date;
};

interface ClientContextProps {
	client: Client | null;
	setClient: React.Dispatch<React.SetStateAction<Client | null>>;
	logged: boolean;
	logout: () => void;
}

const ClientContext = createContext<ClientContextProps>({
	client: null,
	setClient: () => {},
	logged: false,
	logout: () => {},
});

export const useClient = () => useContext(ClientContext);

interface ClientProviderProps {
	children: React.ReactNode;
}

export const ClientProvider = ({ children }: ClientProviderProps) => {
	const [client, setClient] = useState<Client | null>(null);

	const logout = () => {
		setClient(null);
	};

	const value = {
		client,
		setClient,
		logged: Boolean(client),
		logout,
	};

	return (
		<ClientContext.Provider value={value}>{children}</ClientContext.Provider>
	);
};
