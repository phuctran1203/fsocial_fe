import API from "./axiosInstance";

export const getComplaint = async () => {
	try {
		const resp = await API.get(`/complaint`, dataObj);
		const data = resp.data;
		console.log("Resp complaint: ", data);
		return data;
	} catch (error) {
		console.error("Error at complaint:", error);
		return error.response?.data || null;
	}
};

export const getPostComplaint = async () => {
	try {
		const resp = await API.get(`/complaint/post`, dataObj);
		const data = resp.data;
		console.log("Resp post complaint: ", data);
		return data;
	} catch (error) {
		console.error("Error at post complaint:", error);
		return error.response?.data || null;
	}
};

export const getUserComplaint = async () => {
	try {
		const resp = await API.get(`/complaint/user`, dataObj);
		const data = resp.data;
		console.log("Resp user complaint: ", data);
		return data;
	} catch (error) {
		console.error("Error at user complaint:", error);
		return error.response?.data || null;
	}
};

export const postComplaint = async (id) => {
	try {
		const resp = await API.post(`/post/complaint/id=${id}`, dataObj);
		const data = resp.data;
		console.log("Resp postComplaint: ", data);
		return data;
	} catch (error) {
		console.error("Error at postComplaint:", error);
		return error.response?.data || null;
	}
};

export const searchComplaint = async (keyword) => {
	try {
		const resp = await API.get(`/complaint/find?find_name=${keyword}`, dataObj);
		const data = resp.data;
		console.log("Resp search: ", data);
		return data;
	} catch (error) {
		console.error("Error at search:", error);
		return error.response?.data || null;
	}
};