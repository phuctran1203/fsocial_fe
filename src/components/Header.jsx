import React from "react";
import { Bell, LogoNoBG } from "../components/Icon";
import { popupNotificationtStore } from "../store/popupStore";
import { NavLink, useLocation } from "react-router-dom";
import { toast } from "sonner";
export default function Header() {
	const isInMessage = useLocation().pathname === "/message";

	const { isVisible, setIsVisible } = popupNotificationtStore();

	const toggleShowNoti = () => {
		setIsVisible(!isVisible);
	};
	return (
		<header
			className={`z-10 px-3 py-1 bg-background ${
				!isInMessage ? "sm:hidden" : "hidden"
			} w-full absolute top-0 flex justify-between items-center border-gray-3light border-b`}
		>
			<NavLink to="/">
				<LogoNoBG className="size-9" />
			</NavLink>
			<div className="relative">
				<div className="cursor-pointer" onClick={toggleShowNoti}>
					<Bell />
				</div>
				<div className="absolute size-2.5 -top-[1px] right-[1px] bg-primary rounded-full " />
			</div>
		</header>
	);
}
