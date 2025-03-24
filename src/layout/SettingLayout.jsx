import NavSetting from "@/components/NavSetting";
import React from "react";
import { Outlet } from "react-router-dom";

export default function SettingLayout() {
	return (
		<div className="bg-background flex-grow flex h-full">
			<NavSetting />
			<div className="max-w-[740px] mx-auto">
				<Outlet />
			</div>
		</div>
	);
}
