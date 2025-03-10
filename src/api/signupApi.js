import API from "./axiosInstance";

export const checkDuplicate = (data) =>
	API.post("/account/check-duplication", data)
		.then((resp) => {
			const data = resp.data;
			console.log("Resp checkDuplicate: ", data);
			return data;
		})
		.catch((error) => {
			console.error("Error at checkDuplicate: ", error);
			return error.response?.data || {};
		});

export const requestOTP = (data) =>
	API.post("/account/send-otp", data)
		.then((resp) => {
			const data = resp.data;
			console.log("Resp requestOTP: ", data);
			return data;
		})
		.catch((error) => {
			console.error("Error at requestOTP: ", error);
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
			console.error("Error at validOTP: ", error);
			return error.response?.data || {};
		});

export const sendingCreateAccount = (data) =>
	API.post("/account/register", data)
		.then((resp) => {
			const data = resp.data;
			console.log("Resp sendingCreateAccount: ", data);
			return data;
		})
		.catch((error) => {
			console.error("Error at sendingCreateAccount: ", error);
			return error.response?.data || {};
		});
