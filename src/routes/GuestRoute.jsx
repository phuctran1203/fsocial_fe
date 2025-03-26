import { getCookie } from "@/utils/cookie";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestRoute() {
	const refreshToken = getCookie("refresh-token");
	return !refreshToken ? <Outlet /> : <Navigate to="/" />;
}
