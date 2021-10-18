import './Navbar.scss';
import { Fragment, useRef } from 'react';
import { Component, usePanel } from '../../providers/PanelProvider';
import { useClient } from '../../providers/ClientProvider';

interface NavbarProps {
	components: Component[];
}

export const Navbar = ({ components }: NavbarProps) => {
	const openNavbarBTRef = useRef<HTMLInputElement>(null);
	const logoutBTRef = useRef<HTMLButtonElement>(null);
	const logoutOptionsRef = useRef<HTMLSpanElement>(null);

	const { goToSection } = usePanel();
	const { logged, logout } = useClient();

	const handleSelect = (componentName: string) => {
		goToSection(componentName);
		const openNavbarBT = openNavbarBTRef.current as HTMLInputElement;
		openNavbarBT.checked = false;
	};

	const handleLogoutBTClick = () => {
		const logoutBT = logoutBTRef.current as HTMLButtonElement;
		const logoutOptionsContainer = logoutOptionsRef.current as HTMLSpanElement;

		logoutBT.disabled = !logoutBT.disabled;
		logoutBT.classList.toggle('hide');
		logoutOptionsContainer.classList.toggle('hide');
	};

	return (
		<Fragment>
			<input
				type="checkbox"
				name="open-navbar"
				id="open-navbar"
				ref={openNavbarBTRef}
			/>
			<label htmlFor="open-navbar" className="open-navbar-bt">
				menu
			</label>
			<div className="Navbar-container">
				{components.map(({ name }) => {
					if (logged && name === 'Login')
						return (
							<Fragment key="Logout">
								<button
									className="logout-bt"
									ref={logoutBTRef}
									onClick={handleLogoutBTClick}
								>
									Logout
								</button>
								<span className="logout-options hide" ref={logoutOptionsRef}>
									<button onClick={logout}>Yes</button>
									<button onClick={handleLogoutBTClick}>No</button>
								</span>
							</Fragment>
						);
					return (
						<Fragment key={name}>
							<input
								type="radio"
								name="component"
								id={name}
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
		</Fragment>
	);
};
