import API from "./axiosInstance";

export const signupAPI = {
	checkDuplicate: (data) =>
		API.post("/account/check-duplication", data)
			.then((resp) => resp.data)
			.catch((error) => {
				console.log("Error at checkDuplicate: ", error);
				return error.response.data;
			}),

	requestOTP: (data) =>
		API.post("/account/send-otp", data)
			.then((resp) => resp.data)
			.catch((error) => {
				console.log("Error at requestOTP: ", error);
				return error.response.data;
			}),

	validOTP: (data) =>
		API.post("/account/register", data)
			.then((resp) => resp.data)
			.catch((error) => {
				console.log("Error at validOTP: ", error);
				return error.response.data;
			}),
};
