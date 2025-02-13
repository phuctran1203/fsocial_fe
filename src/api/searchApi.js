import API from "./axiosInstance";

export const searchAPI = {
	search: (keyword) =>
		API.post("/search", keyword)
			.then((resp) => resp.data)
			.catch((error) => {
				console.log("Error at search: ", error);
				return error.response.data;
			}),
};
