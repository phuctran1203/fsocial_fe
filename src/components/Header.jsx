import React, { useState } from "react";

import { Bell, HamburgerIcon, LogoNoBG } from "../components/Icon";
import { popupNotificationtStore } from "../store/popupStore";
import { NavLink, useLocation } from "react-router-dom";
import NavMorePopup from "./NavMorePopup";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export default function Header() {
	const isInMessage = useLocation().pathname === "/message";

	const { isVisible, setIsVisible } = popupNotificationtStore();

	const [popoverOpen, setPopoverOpen] = useState(false);

	const toggleShowNoti = () => {
		setIsVisible(!isVisible);
	};

	const closeNotification = () => setIsVisible(false);
	return (
		<>
			{!isInMessage && <div className="h-12" />}{" "}
			{/* =)) thật thông minh, đỉnh cao trí tuệ */}
			<header
				className={`z-10 px-3 h-12 bg-background ${
					!isInMessage ? "sm:hidden" : "hidden"
				} w-full fixed top-0 flex items-center justify-between border-b`}
			>
				<NavLink to="/">
					<LogoNoBG className="size-8" />
				</NavLink>

				<div className="flex items-center gap-2">
					<div className="relative w-fit">
						<div className="cursor-pointer" onClick={toggleShowNoti}>
							<Bell />
						</div>
						<div className="absolute size-2.5 -top-[1px] right-[1px] bg-primary-gradient rounded-full " />
					</div>

					<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
						<PopoverTrigger onClick={closeNotification}>
							<HamburgerIcon />
						</PopoverTrigger>
						<PopoverContent
							sideOffset={10}
							className="bg-background w-screen h-screen rounded-none shadow-xl p-2"
						>
							<NavMorePopup inMobile={true} setPopoverOpen={setPopoverOpen} />
						</PopoverContent>
					</Popover>
				</div>
			</header>
		</>
	);
}
