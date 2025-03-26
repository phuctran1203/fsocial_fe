import { getCookie } from "@/utils/cookie";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function UserRoute() {
	const refreshToken = getCookie("refresh-token");
	const isAdmin = true;
	return refreshToken ? (
		!isAdmin ? (
			<Outlet />
		) : (
			<Navigate to="/admin" />
		)
	) : (
		<Navigate to="/login" />
	);
}
