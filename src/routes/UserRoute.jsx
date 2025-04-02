import { useValidRefreshTokenStore } from "@/store/validRefreshTokenStore";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function UserRoute() {
	const isAdmin = false;
	const refreshToken = useValidRefreshTokenStore.getState().refreshToken;

	return !isAdmin ? (
		refreshToken ? (
			<Outlet />
		) : (
			<Navigate to="login" />
		)
	) : (
		<Navigate to="/admin" />
	);
}
