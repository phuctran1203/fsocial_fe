import API from "./axiosInstance";

export const getPosts = () =>
	API.get("/timeline/post")
		.then((resp) => {
			const data = resp.data;
			console.log("Resp getPosts: ", data);
			return data;
		})
		.catch((error) => {
			console.error("Error at getPosts:", error);
			return error.response?.data || null;
		});

export const createPost = (data) =>
	API.post("/post/actions", data)
		.then((resp) => {
			const data = resp.data;
			console.log("Resp createPost: ", data);
			return data;
		})
		.catch((error) => {
			console.error("Error at createPost:", error);
			return error.response?.data || null;
		});

export const getFollowingPosts = () =>
	API.get("/timeline/post")
		.then((resp) => {
			const data = resp.data;
			console.log("Resp getPosts: ", data);
			return data;
		})
		.catch((error) => {
			console.error("Error at getPosts:", error);
			return error.response?.data || null;
		});
