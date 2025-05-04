import { ownerAccountStore } from "@/store/ownerAccountStore";
import { useValidRefreshTokenStore } from "@/store/validRefreshTokenStore";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function UserRoute() {
  console.log("user route");

  const user = ownerAccountStore((state) => state.user);
  const isAdmin = user.role === "ADMIN";

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
