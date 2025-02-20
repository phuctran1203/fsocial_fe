import API from "./axiosInstance";

export const commentsApi = {
	getComments: (postId) =>
		API.get(`/timeline/comment?postId=${postId}`)
			.then((resp) => {
				const data = resp.data;
				console.log("Resp getComments: ", resp);
				return data;
			})
			.catch((error) => {
				console.log(`Error at getComments for id ${postId}: `, error);
				return error.response.data;
			}),

	sendComment: (data) =>
		API.post(`/post/comment`, data)
			.then((resp) => {
				const data = resp.data;
				console.log("Resp sendComment: ", data);
				return data;
			})
			.catch((error) => {
				console.log(`Error at sendComment: `, error);
				return error.response.data;
			}),

	replyComment: (data) =>
		API.post(`/post/comment/reply`, data)
			.then((resp) => {
				const data = resp.data;
				console.log("Resp sendComment: ", data);
				return data;
			})
			.catch((error) => {
				console.log(`Error at sendComment: `, error);
				return error.response.data;
			}),
};
