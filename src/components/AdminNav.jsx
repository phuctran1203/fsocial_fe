import React, { useEffect, useState } from "react";
import { LogoFSAdmin, LogoutIcon } from "./Icon";
import { adminNavRout } from "@/config/adminNavRout";
import Button from "./Button";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import { useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminNav() {
	const location = useLocation();
	const path = location.pathname;
	const [active, setActive] = useState(null);
	const navRoute = adminNavRout;
	const user = ownerAccountStore((state) => state.user);
	const handleActive = (index) => {
		setActive(index);
	};

	return (
		<nav className="rounded-lg w-[280px] flex flex-col flex-shrink-0 bg-background h-full p-5 border shadow">
			<LogoFSAdmin />

			<div className="mt-8 space-y-3 flex-grow">
				{navRoute.map((route, index) => (
					<Button
						key={index}
						to={route.to}
						className={`btn-transparent !justify-start p-3 py-3.5 gap-3
                            ${path === route.to ? "bg-gray-3light font-medium" : ""}
                            hover:bg-gray-3light`}
					>
						{route.icon}
						{route.name}
					</Button>
				))}
				<Button
					to="/admin/profile"
					className={`btn-transparent !justify-start p-3 py-3.5
                        ${path === "/profile" ? "bg-gray-3light font-medium" : ""}
                        hover:bg-gray-3light`}
				>
					<Avatar className={`size-[26px]`}>
						<AvatarImage src={"../temp/default_avatar.svg"} />
						<AvatarFallback className="text-[12px] font-semibold">{user.firstName.charAt(0) || "?"}</AvatarFallback>
					</Avatar>
				</Button>
			</div>

			<Button
				to="/login"
				className={`btn-transparent justify-self-end !justify-start p-3 py-3.5 gap-3 hover:bg-gray-3light`}
			>
				<LogoutIcon />
				Đăng xuất
			</Button>
		</nav>
	);
}
