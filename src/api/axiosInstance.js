import axios from "axios";
import { refreshToken } from "./tokenManager";
import { getCookie } from "@/utils/cookie";

const originalDomain = "http://localhost:8888/api/v1";

const listBypassToken = [
	"/account/refresh-token",
	"/account/login",
	"/account/check-duplication",
	"/account/send-otp",
	"/account/verify-otp",
	"/account/register",
	"/account/reset-password",
];

// Tạo instance Axios
const API = axios.create({
	baseURL: originalDomain,
	withCredentials: true,
});
// Thêm request interceptor (Thêm token vào header)
API.interceptors.request.use(
	async (config) => {
		const token = getCookie("access-token");
		const path = new URL(config.url, API.defaults.baseURL).pathname;
		// api không cần token
		if (listBypassToken.includes(path)) {
			return config;
		}
		// nếu có token
		config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => Promise.reject(error)
);

// Thêm response interceptor (Xử lý lỗi token hết hạn)
API.interceptors.response.use(
	(response) => response,
	async (error) => {
		const path = new URL(error.config.url, API.defaults.baseURL).pathname;

		// Nếu lỗi từ request refresh-token thì không gọi lại refreshToken nữa
		if (path === "/account/refresh-token") {
			return Promise.reject(error);
		}

		// Nếu lỗi 401 từ các API khác, thử refresh token
		if (error.response?.status === 401) {
			console.log("Token hết hạn, làm mới token...");
			const resp = await refreshToken();
			// đoạn này không bắt statusCode, ko check resp nữa
			// vì refreshToken sẽ gọi lại API axiosInstance này,
			// nếu response của refreshToken có lỗi
			// thì sẽ bị axiosInstance này tóm từ bên trên -> "if (path === "/account/refresh-token"){}"
			// nếu không bị tóm thì sẽ chạy được xuống dưới này
			console.log("Làm mới token thành công, thử gửi lại request...");
			error.config.headers["Authorization"] = `Bearer ${resp.data.accessToken}`;
			return API(error.config);
		}

		return Promise.reject(error);
	}
);

export default API;
