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
	goToBase: () => void;
}

const PanelContext = createContext<PanelContextProps>({
	actualSection: '',
	goToSection: () => {},
	goToBase: () => {},
});

export const usePanel = () => useContext(PanelContext);
interface PanelProviderProps {
	components: Component[];
	children: React.ReactNode;
	baseComponent: {
		ifLogged: string;
		ifNotLogged: string;
	};
}

export const PanelProvider = ({
	components,
	baseComponent,
	children,
}: PanelProviderProps) => {
	const [base, setBase] = useState<string>(baseComponent.ifNotLogged);
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

	const goToBase = () => {
		goToSection(base);
	};

	useEffect(() => {
		if (logged) {
			goToSection(baseComponent.ifLogged);
			setBase(baseComponent.ifLogged);
		} else {
			goToSection(baseComponent.ifNotLogged);
			setBase(baseComponent.ifNotLogged);
		}
	}, [logged]);

	const actualSection = componentsVisibility.reduce<string>((_, arr) => {
		if (arr.visibility) return arr.name;
		else return '';
	}, '');

	const value = {
		goToSection,
		goToBase,
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
