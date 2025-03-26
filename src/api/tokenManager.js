import { deleteCookie, getCookie, setCookie } from "@/utils/cookie";
import API from "./axiosInstance";

export const refreshToken = async () => {
	try {
		const refreshToken = getCookie("refresh-token");
		const resp = await API.post("/account/refresh-token", { refreshToken });
		const data = resp.data;
		// Lưu token mới vào cookie
		setCookie("access-token", data.data.accessToken, 360 * 10);
		return data;
	} catch (error) {
		console.error("Error at refreshToken: ", error);
		deleteCookie("refresh-token");
		deleteCookie("access-token");
		return error.response?.data || null;
	}
};
