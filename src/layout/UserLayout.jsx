import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Notification from "../components/Notification";
import Header from "../components/Header";

export default function UserLayout() {
	return (
		<>
			{/* nav top appear in mobile */}
			<Header />
			<main className="flex">
				<Nav />
				<Outlet />
				<Notification />
			</main>
		</>
	);
}
