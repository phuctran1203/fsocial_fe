import API from "./axiosInstance";

export const postsApi = {
	getPosts: (signal) =>
		API.get("/timeline/post", { signal })
			.then((resp) => resp.data)
			.catch((error) => {
				console.error("Error at getPosts:", error);
				return error.response?.data || null;
			}),
	getComments: (id, signal) =>
		API.get("/comments", { signal })
			.then((resp) => resp.data.filter((comment) => comment.postID == id))
			.catch((error) => {
				console.log(`Error at getComments for id ${id}: `, error);
				return error.response.data;
			}),
};
