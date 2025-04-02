import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
	const isAdmin = true;
	return isAdmin ? <Outlet /> : <Navigate to="/" />;
}
