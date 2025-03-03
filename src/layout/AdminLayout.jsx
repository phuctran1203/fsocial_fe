import AdminNav from "@/components/AdminNav";
import React from "react";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
	return (
		<main className="p-3 flex gap-5 h-screen bg-background-lower">
			<AdminNav />
			<div className="bg-background rounded-lg flex-grow">
				<Outlet />
			</div>
		</main>
	);
}
