import axios from "axios";

const originalDomain = "http://localhost:8081";
// const originalDomain = "http://localhost:8888/api/v1";

// Tạo instance Axios
const API = axios.create({
	baseURL: originalDomain,
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});

// Thêm request interceptor (Thêm token vào header)
API.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		const path = new URL(config.url, API.defaults.baseURL).pathname;
		// Nếu request đến /login hoặc /register, không cần token
		if (["/login", "/signup"].includes(path)) {
			return config;
		}
		// Có token nhưng cố mở login hoặc resigter
		if (token && ["/login", "/signup"].includes(path)) {
			window.location.href = "/home";
			return Promise.reject(new Error("Redirecting to home..."));
		}
		// if (!token) {
		// 	window.location.href = "/login"; // Redirect về trang đăng nhập
		// 	return Promise.reject(new Error("Redirecting to login..."));
		// }
		if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => Promise.reject(error)
);

// Thêm response interceptor (Xử lý lỗi token hết hạn)
API.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			console.log("Token hết hạn, đăng xuất...");
			localStorage.removeItem("token");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);

export default API;
