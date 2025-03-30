import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
	const isAdmin = false;
	return isAdmin ? <Outlet /> : <Navigate to="/" />;
}
