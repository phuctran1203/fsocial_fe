import AdminNav from "@/components/AdminNav";
import React from "react";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
	return (
		<main className="p-3 flex gap-4 h-screen bg-background-lower">
			<AdminNav />
			<Outlet />
		</main>
	);
}
