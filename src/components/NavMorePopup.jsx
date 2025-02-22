import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LogoutIcon, KeyIcon, SunIcon, SwitchIcon, MoonIcon, CheckIcon } from "./Icon";
import styles from "./Nav.module.scss";
import { useNavigate } from "react-router-dom";

export default function NavMorePopup({ inMobile }) {
	const [mode, setMode] = useState(localStorage.getItem("theme") || "light");

	const handleSetMode = (modePicked) => {
		setMode(modePicked);
		if (modePicked === "light") {
			document.body.classList.remove("dark");
		} else if (modePicked === "dark") {
			document.body.classList.add("dark");
		}
		localStorage.setItem("theme", modePicked);
	};

	const [switchThemeOpen, setSwitchThemeOpen] = useState(false);

	const navigate = useNavigate();
	const handleLogout = () => {
		navigate("/login");
	};

	return (
		<>
			<Popover onOpenChange={setSwitchThemeOpen}>
				<PopoverTrigger className={`group ${styles.navMore} ${switchThemeOpen && "bg-gray-3light"}`}>
					<SunIcon />
					<span>Chế độ hiển thị</span>
					<svg
						className={`ms-auto me-1 sm:group-hover:opacity-100 ${
							switchThemeOpen ? "sm:opacity-100 opacity-0" : "opacity-0"
						} size-4 transition`}
						viewBox="0 0 16 16"
						fill="none"
					>
						<path
							className="fill-primary-text"
							d="M12.7053 7.29365C13.0959 7.68428 13.0959 8.31865 12.7053 8.70928L6.70525 14.7093C6.31463 15.0999 5.68025 15.0999 5.28963 14.7093C4.899 14.3187 5.32226 13.5333 5.71289 13.1426L10.856 7.99979L5.42746 2.57122C5.03684 2.18059 4.90213 1.68115 5.29275 1.29053C5.68338 0.899902 6.31775 0.899902 6.70838 1.29053L12.7084 7.29053L12.7053 7.29365Z"
						/>
					</svg>
				</PopoverTrigger>

				<PopoverContent
					side={!inMobile ? "right" : "top"}
					align="start"
					sideOffset={!inMobile ? 20 : 0}
					className="bg-background p-2 sm:w-44 space-y-2"
				>
					<button
						className={`${styles.navMore} !gap-2 border ${mode == "light" && "shadow-md"}`}
						onClick={() => handleSetMode("light")}
					>
						<SunIcon />
						<span>Sáng</span>
						<CheckIcon className={`ms-auto ${mode != "light" && "hidden"}`} />
					</button>

					<button
						className={`${styles.navMore} !gap-2 border ${mode == "dark" && "bg-gray-2light"}`}
						onClick={() => handleSetMode("dark")}
					>
						<MoonIcon />
						<span>Tối</span>
						<CheckIcon className={`ms-auto ${mode != "dark" && "hidden"}`} />
					</button>
				</PopoverContent>
			</Popover>

			<button className={styles.navMore}>
				<KeyIcon />
				<span>Đổi mật khẩu</span>
			</button>

			<hr className="my-1" />

			<button className={styles.navMore}>
				<SwitchIcon />
				<span>Đổi tài khoản</span>
			</button>

			<button className={styles.navMore} onClick={handleLogout}>
				<LogoutIcon />
				<span>Đăng xuất</span>
			</button>
		</>
	);
}
