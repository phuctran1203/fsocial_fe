import API from "./axiosInstance";

export const getComments = (postId) =>
	API.get(`/timeline/comment?postId=${postId}`)
		.then((resp) => {
			const data = resp.data;
			console.log("Resp getComments: ", data);
			return data;
		})
		.catch((error) => {
			console.error(`Error at getComments for id ${postId}: `, error);
			return error.response?.data || null;
		});

export const sendComment = (data) =>
	API.post(`/post/comment`, data)
		.then((resp) => {
			const data = resp.data;
			console.log("Resp sendComment: ", data);
			return data;
		})
		.catch((error) => {
			console.error(`Error at sendComment: `, error);
			return error.response?.data || null;
		});

export const replyComment = (data) =>
	API.post(`/post/comment/reply`, data)
		.then((resp) => {
			const data = resp.data;
			console.log("Resp sendComment: ", data);
			return data;
		})
		.catch((error) => {
			console.error(`Error at sendComment: `, error);
			return error.response.data;
		});

export const getRepliesComment = (commentId) =>
	API.get(`/timeline/comment/reply?comment_id=${commentId}`)
		.then((resp) => {
			const data = resp.data;
			console.log("Resp getRepliesComment: ", data);
			return data;
		})
		.catch((error) => {
			console.error(
				`Error at getRepliesComment for commentId ${commentId}: `,
				error
			);
			return error.response?.data || null;
		});
