import { deleteCookie, getCookie, setCookie } from "@/utils/cookie";
import API from "./axiosInstance";
import { useValidRefreshTokenStore } from "@/store/validRefreshTokenStore";

export const refreshToken = async () => {
	const setRefreshToken = useValidRefreshTokenStore.getState().setRefreshToken;
	try {
		const refreshToken = getCookie("refresh-token");
		const resp = await API.post("/account/refresh-token", { refreshToken });
		const data = resp.data;
		// Lưu token mới vào cookie
		setCookie("access-token", data.data.accessToken, 360 * 10);
		return data;
	} catch (error) {
		console.error("Error at refreshToken: ", error);
		setRefreshToken(null);
		return error.response?.data || null;
	}
};
