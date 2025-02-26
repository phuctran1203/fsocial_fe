import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Notification from "../components/Notification";
import Header from "../components/Header";
import CreatePost from "../components/CreatePost";
import { Toaster } from "sonner";
import { getOwnerProfile } from "@/api/profileApi";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import ReportModal from "@/components/ReportModal";

export default function UserLayout() {
	const setUser = ownerAccountStore((state) => state.setUser);

	const getUserDetail = async () => {
		const resp = await getOwnerProfile();
		if (resp.statusCode === 200) {
			setUser(resp.data);
		}
	};

	useEffect(() => {
		getUserDetail();
	}, []);

	return (
		<>
			{/* nav top appear in mobile */}
			<main className="sm:flex relative h-[100dvh]">
				<Header />
				<Nav />
				<Outlet />
				<Notification />
				<CreatePost />
				<ReportModal />
			</main>
			<Toaster position="top-right" />
		</>
	);
}
