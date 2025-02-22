import React from "react";

import { Bell, HamburgerIcon, LogoNoBG } from "../components/Icon";
import { popupNotificationtStore } from "../store/popupStore";
import { NavLink, useLocation } from "react-router-dom";
import NavMorePopup from "./NavMorePopup";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function Header() {
	const isInMessage = useLocation().pathname === "/message";

	const { isVisible, setIsVisible } = popupNotificationtStore();

	const toggleShowNoti = () => {
		setIsVisible(!isVisible);
	};

	const closeNotification = () => setIsVisible(false);
	return (
		<header
			className={`z-10 px-3 py-2 bg-background ${
				!isInMessage ? "sm:hidden" : "hidden"
			} w-full absolute flex items-center justify-between top-0 border-b`}
		>
			<NavLink to="/">
				<LogoNoBG className="size-8" />
			</NavLink>

			<div className="flex items-center gap-2">
				<div className="relative w-fit">
					<div className="cursor-pointer" onClick={toggleShowNoti}>
						<Bell />
					</div>
					<div className="absolute size-2.5 -top-[1px] right-[1px] bg-primary rounded-full " />
				</div>

				<Popover>
					<PopoverTrigger onClick={closeNotification}>
						<HamburgerIcon />
					</PopoverTrigger>
					<PopoverContent sideOffset={10} className="bg-background w-screen h-screen rounded-none shadow-xl p-2">
						<NavMorePopup inMobile={true} />
					</PopoverContent>
				</Popover>
			</div>
		</header>
	);
}
