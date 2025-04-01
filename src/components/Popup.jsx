import { usePopupStore } from "@/store/popupStore";
import { themeStore } from "@/store/themeStore";
import React, { useEffect, useRef } from "react";
import { XMarkIcon } from "./Icon";
import { cn } from "@/lib/utils";

export default function Popup() {
	const { heading, isOpen, children, hidePopup } = usePopupStore();

	const theme = themeStore((state) => state.theme);

	return (
		<div
			className={`z-10 fixed inset-0 sm:py-2 bg-black flex items-center justify-center ${
				isOpen ? "bg-opacity-35 visible" : "bg-opacity-0 invisible"
			}
            transition`}
			onClick={() => hidePopup()}
		>
			<div
				className={`
				flex flex-col bg-background max-h-screen rounded-lg overflow-hidden ${
					theme === "dark" && "border"
				}
				${isOpen ? "translate-y-0" : "translate-y-[100dvh]"}
				transition`}
				onClick={(e) => e.stopPropagation()}
			>
				<div
					className={`relative ${
						heading ? "border-b py-2" : "flex justify-end"
					}`}
				>
					<h5 className="text-center">{heading}</h5>
					<button
						className={`px-3 ${
							heading
								? "h-full absolute right-0 top-1/2 -translate-y-1/2"
								: "pt-3"
						}`}
						onClick={() => hidePopup()}
					>
						<XMarkIcon />
					</button>
				</div>

				{children}
			</div>
		</div>
	);
}
