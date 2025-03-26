import { ownerAccountStore } from "@/store/ownerAccountStore";
import React from "react";

export default function UserAccountLogin() {
	const user = ownerAccountStore((state) => state.user);
	return <div>abc</div>;
}
