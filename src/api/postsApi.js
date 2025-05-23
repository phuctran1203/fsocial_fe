import { ownerAccountStore } from "@/store/ownerAccountStore";
import API from "./axiosInstance";

export const getPosts = async (userId, controller) => {
	try {
		const resp = await API.get(
			`/timeline/post?userId=${userId}`,
			controller && { signal: controller.signal }
		);
		const data = resp.data;
		console.log("Resp getPosts: ", data);
		return data;
	} catch (error) {
		if (error.name === "CanceledError") return null;
		console.error("Error at getPosts:", error);
		return null;
	}
};

export const getPost = async (userId, postId, controller) => {
	try {
		const resp = await API.get(
			`/timeline/post/getpost_id?user_id=${userId}&post_id=${postId}`,
			controller && { signal: controller.signal }
		);
		const data = resp.data;
		console.log("Resp getPost: ", data);
		return data;
	} catch (error) {
		if (error.name === "CanceledError") return null;
		console.error("Error at getPost:", error);
		return null;
	}
};

export const likePost = async (postId) => {
	const user = ownerAccountStore.getState().user;
	const dataObj = {
		userId: user.userId,
		postId: postId,
	};
	console.log("data prepared: ", dataObj);

	try {
		const resp = await API.post(`/post/actions/like`, dataObj);
		const data = resp.data;
		console.log("Resp likePost: ", data);
		return data;
	} catch (error) {
		console.error("Error at likePost:", error);
		return error.response?.data || null;
	}
};

export const createPost = (data, config = {}) =>
	API.post("/post/actions", data, { ...config })
		.then((resp) => {
			const data = resp.data;
			console.log("Resp createPost: ", data);
			return data;
		})
		.catch((error) => {
			console.error("Error at createPost:", error);
			return error.response?.data || null;
		});

export const updatePost = (data) =>
	API.put("/post/actions", data)
		.then((resp) => {
			const data = resp.data;
			console.log("Resp updatePost: ", data);
			return data;
		})
		.catch((error) => {
			console.error("Error at updatePost:", error);
			return error.response?.data || null;
		});

export const deletePost = (id) =>
	API.delete(`/post/actions?postId=${id}`)
		.then((resp) => {
			const data = resp.data;
			console.log("Resp deletePost: ", data);
			return data;
		})
		.catch((error) => {
			console.error("Error at deletePost:", error);
			return error.response?.data || null;
		});

export const repostPost = (data) =>
	API.post(`/post/actions/share`, data)
		.then((resp) => {
			const data = resp.data;
			console.log("Resp repostPost: ", data);
			return data;
		})
		.catch((error) => {
			console.error("Error at repostPost:", error);
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

export const reportPost = (data) =>
	API.post("/post/complaint", data)
		.then((resp) => {
			const data = resp.data;
			console.log("Resp reportPost: ", data);
			return data;
		})
		.catch((error) => {
			console.error("Error at reportPost:", error);
			return error.response?.data || null;
		});
