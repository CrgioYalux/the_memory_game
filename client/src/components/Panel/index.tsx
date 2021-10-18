import './Panel.scss';
import { Navbar } from '../Navbar';
import { useState, useEffect, Fragment } from 'react';
import { useClient } from '../../providers/ClientProvider';

interface PanelProps {
	value: Component[];
}

export type Component = {
	name: string;
	component: React.ReactNode;
	visibility: boolean;
};

export const Panel = ({ value }: PanelProps) => {
	const { logged } = useClient();
	const [componentsVisibility, setComponentsVisibility] =
		useState<Component[]>(value);

	useEffect(() => {
		setComponentsVisibility((prev) => {
			return prev.map(({ component, name, visibility }) => {
				if (logged) {
					if (name === 'Scoreboard') {
						visibility = true;
					} else {
						visibility = false;
					}
				} else {
					if (name === 'Login') {
						visibility = true;
					} else {
						visibility = false;
					}
				}
				return { component, name, visibility };
			});
		});
	}, [logged]);

	return (
		<Fragment>
			<Navbar
				components={componentsVisibility}
				selectComponent={setComponentsVisibility}
			/>
			{componentsVisibility.map(({ component, name, visibility }) => {
				if (visibility === true)
					return <Fragment key={name}>{component}</Fragment>;
			})}
		</Fragment>
	);
};
