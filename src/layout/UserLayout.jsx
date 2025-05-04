import React, { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Notification from "../components/Notification";
import Header from "../components/Header";
import { toast, Toaster } from "sonner";
import { getOwnerProfile } from "@/api/profileApi";
import { ownerAccountStore } from "@/store/ownerAccountStore";
import Popup from "@/components/Popup";
import { getCookie } from "@/utils/cookie";
import { jwtDecode } from "jwt-decode";
import useMessageStore from "@/store/messageStore";
import { useValidRefreshTokenStore } from "@/store/validRefreshTokenStore";
import ExpiredDialog from "@/components/ExpiredDialog";
import useNotificationsStore from "@/store/notificationStore";
import cleanupStore from "@/utils/cleanupStore";

export default function UserLayout() {
  const { setUser } = ownerAccountStore();
  const { refreshToken } = useValidRefreshTokenStore();
  const { connectNotificationWebSocket } = useNotificationsStore();
  const { connectMessageWebSocket } = useMessageStore();

  const getUserDetail = async () => {
    const resp = await getOwnerProfile();
    if (!resp) return;
    const accessToken = getCookie("access-token");
    if (!accessToken) {
      console.log("User layout: không có accessToken trong cookie");
      return;
    }
    const jwtDecoded = jwtDecode(accessToken);
    const userId = jwtDecoded.sub;
    const role = jwtDecoded.scope;
    console.log("decode jwt: ", jwtDecode(accessToken));
    console.log("lấy được userId: ", userId);
    console.log("lấy được role: ", role);

    setUser({ userId, role, ...resp.data });
    connectNotificationWebSocket(userId);
    connectMessageWebSocket(userId);
  };

  useEffect(() => {
    getUserDetail();
    return () => {
      cleanupStore();
    };
  }, []);

  return (
    <>
      {/* nav top appear in mobile */}
      <>
        <main className="sm:flex relative h-[100dvh]">
          <Header />
          <Nav />
          {refreshToken ? <Outlet /> : <ExpiredDialog />}
          <Notification />
        </main>
        <Popup />
        <Toaster position="top-center" />
      </>
    </>
  );
}
