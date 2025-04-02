import { deleteCookie, getCookie } from "@/utils/cookie";
import { create } from "zustand";

export const useValidRefreshTokenStore = create((set) => ({
	refreshToken: getCookie("refresh-token"),

	setRefreshToken: (refreshToken) =>
		set(() => {
			if (!refreshToken) {
				deleteCookie("refresh-token");
				deleteCookie("access-token");
			}
			return { refreshToken };
		}),
}));
