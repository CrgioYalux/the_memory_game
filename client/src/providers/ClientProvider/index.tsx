import { createContext, useContext, useState } from 'react';

export type Client = {
	player: {
		username: string;
		nickname: string;
	};
	game: {
		points: number;
		time: string;
	};
	id: string;
	updatedAt: Date;
};

interface ClientContextProps {
	client: Client | undefined;
	setClient: React.Dispatch<React.SetStateAction<Client | undefined>>;
	logged: boolean;
	logout: () => void;
}

const ClientContext = createContext<ClientContextProps>({
	client: undefined,
	setClient: () => {},
	logged: false,
	logout: () => {},
});

export const useClient = () => useContext(ClientContext);

interface ClientProviderProps {
	children: React.ReactNode;
}

export const ClientProvider = ({ children }: ClientProviderProps) => {
	const [client, setClient] = useState<Client>();

	const logout = () => {
		setClient(undefined);
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
