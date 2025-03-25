import NavSetting from "@/components/NavSetting";
import React from "react";
import { Outlet } from "react-router-dom";

export default function SettingLayout() {
	return (
		<div className="bg-background flex-grow flex h-full">
			<NavSetting />
			<div className="container max-w-[740px] overflow-y-auto">
				<Outlet />
			</div>
		</div>
	);
}
