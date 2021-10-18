import { useState, useEffect, Fragment } from 'react';
import { createContext, useContext } from 'react';
import { useClient } from '../../providers/ClientProvider';

export type Component = {
	name: string;
	component: React.ReactNode;
	visibility: boolean;
};

interface PanelContextProps {
	actualSection: string;
	goToSection: (sectionName: string) => void;
}

const PanelContext = createContext<PanelContextProps>({
	actualSection: '',
	goToSection: () => {},
});

export const usePanel = () => useContext(PanelContext);
interface PanelProviderProps {
	components: Component[];
	children: React.ReactNode;
}

export const PanelProvider = ({ components, children }: PanelProviderProps) => {
	const { logged } = useClient();
	const [componentsVisibility, setComponentsVisibility] =
		useState<Component[]>(components);

	const goToSection = (sectionName: string) => {
		setComponentsVisibility((prev) => {
			return prev.map(({ component, name, visibility }) => {
				if (sectionName === name) visibility = true;
				else visibility = false;
				return { component, name, visibility };
			});
		});
	};

	useEffect(() => {
		setComponentsVisibility((prev) => {
			return prev.map(({ component, name, visibility }) => {
				if (logged) goToSection('Scoreboard');
				else goToSection('Login');
				return { component, name, visibility };
			});
		});
	}, [logged]);

	const actualSection = componentsVisibility.reduce<string>((acc, arr) => {
		if (arr.visibility) return arr.name;
		else return '';
	}, '');

	const value = {
		goToSection,
		actualSection,
	};

	return (
		<PanelContext.Provider value={value}>
			{children}
			{componentsVisibility.map(({ component, name, visibility }) => {
				if (visibility === true)
					return <Fragment key={name}>{component}</Fragment>;
			})}
		</PanelContext.Provider>
	);
};
