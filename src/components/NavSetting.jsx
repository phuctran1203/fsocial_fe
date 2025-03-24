import { settingNavRoute } from "@/config/settingNavRoute";
import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Nav.module.scss";
import { cn } from "@/lib/utils";

export default function NavSetting() {
	return (
		<div className="pt-5 px-5 h-full w-[300px] border-r space-y-2">
			<h4 className="mb-5">Cài đặt</h4>
			{settingNavRoute.map((item, index) => (
				<NavLink key={index} to={item.to} className={cn(styles.navBaseStyle)}>
					{item.icon} {item.content}
				</NavLink>
			))}
		</div>
	);
}
