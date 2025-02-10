import React from "react";
import { Bell, LogoNoBG } from "../components/Icon";
import { popupNotificationtStore } from "../store/popupStore";
import { NavLink } from "react-router-dom";
export default function Header() {
	const { isVisible, setIsVisible } = popupNotificationtStore();

	const toggleShowNoti = () => {
		setIsVisible(!isVisible);
	};
	return (
		<header className="z-10 px-3 py-1 bg-[--background-clr] sm:hidden w-full absolute top-0 flex justify-between items-center border-[--gray-extra-light-clr] border-b-[1px]">
			<NavLink to="/">
				<LogoNoBG className="size-9" />
			</NavLink>
			<div className="relative">
				<div className="cursor-pointer" onClick={toggleShowNoti}>
					<Bell />
				</div>
				<div className="absolute size-2.5 -top-[1px] right-[1px]  bg-[--primary-clr] rounded-full " />
			</div>
		</header>
	);
}
