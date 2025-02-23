import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Notification from "../components/Notification";
import Header from "../components/Header";
import CreatePost from "../components/CreatePost";
import { Toaster } from "sonner";

export default function UserLayout() {
	return (
		<>
			{/* nav top appear in mobile */}
			<Header />
			<main className="flex relative h-[100dvh]">
				<Nav />
				<Outlet />
				<Notification />
				<CreatePost />
			</main>
			<Toaster richColors position="top-right" />
		</>
	);
}
