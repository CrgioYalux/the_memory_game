import './Navbar.scss';
import { Component } from '../Panel';
import { Fragment } from 'react';

interface NavbarProps {
	selectComponent: React.Dispatch<React.SetStateAction<Component[]>>;
	components: Component[];
}

export const Navbar = ({ selectComponent, components }: NavbarProps) => {
	const handleSelect = (componentName: string) => {
		selectComponent((prev) =>
			prev.map(({ component, name }) => {
				if (name === componentName) {
					return { component, name, visibility: true };
				}
				return { component, name, visibility: false };
			}),
		);
	};

	return (
		<>
			<input
				type="checkbox"
				name="open-navbar"
				id="open-navbar"
				defaultChecked
			/>
			<label htmlFor="open-navbar" className="open-navbar-bt">
				menu
			</label>
			<div className="Navbar-container" onSubmit={(e) => e.preventDefault()}>
				{components.map(({ name, visibility }) => {
					return (
						<Fragment key={name}>
							<input
								type="radio"
								name="component"
								id={name}
								checked={visibility}
								onChange={() => {}}
							/>
							<label htmlFor={name} onClick={() => handleSelect(name)}>
								{name}
							</label>
						</Fragment>
					);
				})}
			</div>
			<div className="Navbar-background"></div>
		</>
	);
};
