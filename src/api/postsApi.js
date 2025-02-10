import API from "./axiosInstance";

export const postsApi = {
	getPosts: () => API.get("/posts"),
	getComments: async (id) => {
		const resp = await API.get("/comments");
		const data = await resp.data;

		return data.filter((comment) => comment.postID == id);
	},
};
