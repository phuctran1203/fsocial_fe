import API from "./axiosInstance";

export const postsApi = {
	getPosts: (signal) =>
		API.get("/posts", { signal })
			.then((resp) => resp.data)
			.catch((error) => {
				console.error("Lỗi lấy post:", error);
				return null;
			}),
	getComments: (id, signal) =>
		API.get("/comments", { signal })
			.then((resp) => resp.data.filter((comment) => comment.postID == id))
			.catch((error) => {
				console.log(`Lỗi lấy comment cho bài ${id}: `, error);
				return null;
			}),
};
