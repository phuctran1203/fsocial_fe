import { useValidRefreshTokenStore } from "@/store/validRefreshTokenStore";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestRoute() {
	const { refreshToken } = useValidRefreshTokenStore();
	return !refreshToken ? <Outlet /> : <Navigate to="/" />;
}
