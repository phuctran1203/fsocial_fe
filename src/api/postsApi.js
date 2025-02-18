import API from "./axiosInstance";

export const postsApi = {
	getPosts: (signal) =>
		API.get("/timeline/post", { signal })
			.then((resp) => {
				const data = resp.data;
				console.log("Resp getPosts: ", data);
				return data;
			})
			.catch((error) => {
				console.error("Error at getPosts:", error);
				return error.response.data;
			}),

	createPost: (data) =>
		API.post("/post/actions", data)
			.then((resp) => {
				const data = resp.data;
				console.log("Resp createPost: ", data);
				return data;
			})
			.catch((error) => {
				console.error("Error at createPost:", error);
				return error.response?.data || null;
			}),
};
