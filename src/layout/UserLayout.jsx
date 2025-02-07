import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Notification from "../components/Notification";

export default function UserLayout() {
	return (
		<main className="flex">
			<Nav />
			<Outlet />
			<Notification />
		</main>
	);
}
