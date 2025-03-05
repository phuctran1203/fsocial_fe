import { usePopupStore } from "@/store/popupStore";
import { themeStore } from "@/store/themeStore";
import React from "react";
import { XMarkIcon } from "./Icon";
import { cn } from "@/lib/utils";

export default function Popup() {
	const { popupHeading, isOpen, children, hidePopup, className } = usePopupStore();

	const theme = themeStore((state) => state.theme);
	return (
		<div
			className={`z-10 fixed inset-0 sm:py-2 bg-black flex items-center justify-center ${
				isOpen ? "bg-opacity-30 visible" : "bg-opacity-0 invisible"
			}
            transition`}
			onClick={() => hidePopup()}
		>
			<div
				className={`
				flex flex-col bg-background max-h-screen rounded-lg overflow-hidden ${theme === "dark" && "border"}
				${isOpen ? "translate-y-0" : "translate-y-[100dvh]"}
				transition`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="border-b relative py-2">
					<h5 className="text-center">{popupHeading}</h5>
					<button className="absolute right-0 top-0 h-full px-4" onClick={() => hidePopup()}>
						<XMarkIcon />
					</button>
				</div>

				{children}
			</div>
		</div>
	);
}
