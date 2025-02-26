import API from "./axiosInstance";

export const searchUsers = (keyword) =>
	API.get(`/profile/actions/find?find_name=${keyword}`)
		.then((resp) => {
			const data = resp.data;
			console.log("Resp searchUsers: ", resp);
			return data;
		})
		.catch((error) => {
			console.log(`Error at searchUsers for keyword ${keyword}: `, error);
			return error.response?.data || null;
		});

export const searchPosts = (keyword) =>
	API.get(`/timeline/post/find?find_post=${keyword}`)
		.then((resp) => {
			const data = resp.data;
			console.log("Resp searchPosts: ", resp);
			return data;
		})
		.catch((error) => {
			console.log(`Error at searchPosts for keyword ${keyword}: `, error);
			return error.response?.data || null;
		});
