import API from "./axiosInstance";

export const requestOTP = (data) =>
	API.post("/account/send-otp", data)
		.then((resp) => {
			const data = resp.data;
			console.log("Resp requestOTP: ", data);
			return data;
		})
		.catch((error) => {
			console.log("Error at requestOTP: ", error);
			return error.response?.data || {};
		});

export const validOTP = (data) =>
	API.post("/account/verify-otp", data)
		.then((resp) => {
			const data = resp.data;
			console.log("Resp validOTP: ", data);
			return data;
		})
		.catch((error) => {
			console.log("Error at validOTP: ", error);
			return error.response?.data || {};
		});

export const changePassword = (data) =>
	API.put("/account/reset-password", data)
		.then((resp) => {
			const data = resp.data;
			console.log("Resp validOTP: ", data);
			return data;
		})
		.catch((error) => {
			console.log("Error at validOTP: ", error);
			return error.response?.data || {};
		});
