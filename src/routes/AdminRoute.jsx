import { ownerAccountStore } from "@/store/ownerAccountStore";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute() {
  const user = ownerAccountStore((state) => state.user);
  const isAdmin = user.role === "ADMIN";
  return isAdmin ? <Outlet /> : <Navigate to="/" />;
}
