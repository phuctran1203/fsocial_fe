import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Notification from "../components/Notification";
import Header from "../components/Header";
import { Toaster } from "sonner";
import { getOwnerProfile } from "@/api/profileApi";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import Popup from "@/components/Popup";
import { getCookie } from "@/utils/cookie";
import { jwtDecode } from "jwt-decode";

export default function UserLayout() {
	const setUser = ownerAccountStore((state) => state.setUser);

	const getUserDetail = async () => {
		const resp = await getOwnerProfile();
		// if (resp.statusCode === 200) {
		const accessToken = getCookie("access-token");
		let userId = jwtDecode(accessToken).sub;
		console.log("userId: ", userId);
		setUser({ userId, ...resp.data });
		console.log(ownerAccountStore.getState().user);

		// }
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
			</main>
			<Popup />
			<Toaster position="top-center" />
		</>
	);
}
