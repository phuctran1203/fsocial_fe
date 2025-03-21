import React, { useEffect, useRef } from "react";
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
import { useNotificationSocket } from "@/hooks/webSocket";
import useMessageStore from "@/store/messageStore";

export default function UserLayout() {
	const { user, setUser } = ownerAccountStore();

	const { subscribeNotification } = useNotificationSocket();
	const { stompClient, connectWebSocket, subscribeMessageGlobal } =
		useMessageStore();

	const getUserDetail = async () => {
		const resp = await getOwnerProfile();
		if (!resp) return;
		const accessToken = getCookie("access-token");
		let userId = jwtDecode(accessToken).sub;
		setUser({ userId, ...resp.data });
		subscribeNotification(userId);
		connectWebSocket();
	};

	useEffect(() => {
		if (!user?.userId) {
			getUserDetail();
		} else if (stompClient) {
			subscribeMessageGlobal(user.userId);
		}
	}, [stompClient]);

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
