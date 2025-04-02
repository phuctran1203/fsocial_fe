import API from "./axiosInstance";

export const login = (data) =>
	API.post("/account/login", data)
		.then((resp) => {
			const data = resp.data;
			console.log("Resp login: ", data);
			return data;
		})
		.catch((error) => {
			console.error("Error at login: ", error);
			return error.response?.data || null;
		});
