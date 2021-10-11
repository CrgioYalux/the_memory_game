import './Panel.scss';
import { Navbar } from '../Navbar';
import { useState, Fragment } from 'react';

interface PanelProps {
	value: Component[];
}

export type Component = {
	name: string;
	component: React.ReactNode;
	visibility: boolean;
};

export const Panel = ({ value }: PanelProps) => {
	const [componentsVisibility, setComponentsVisibility] =
		useState<Component[]>(value);

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
