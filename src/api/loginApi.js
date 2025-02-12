import API from "./axiosInstance";

export const loginAPI = {
	login: (data) =>
		API.post("/account/login", data)
			.then((resp) => {
				return resp.data;
			})
			.catch((error) => {
				console.log("Error at login: ", error);
				return error.response.data;
			}),
};
