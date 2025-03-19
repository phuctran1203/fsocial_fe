import API from './axiosInstance';

export const getNumberOfPost = async () => {
	try {
		const resp = await API.get(`/report/NumberOfPost`);
		const data = resp.data;
		console.log("Resp number of post: ", data);
		return data;
	} catch (error) {
		console.error("Error at number of post:", error);
		return error.response?.data || null;
	}
};

export const getNumberOfNewRegistration = async () => {
	try {
		const resp = await API.get(`/report`);
		const data = resp.data;
		console.log("Resp Number Of New Registration: ", data);
		return data;
	} catch (error) {
		console.error("Error at Number Of New Registration:", error);
		return error.response?.data || null;
	}
};

export const getNumberOfComplaint = async () => {
	try {
		const resp = await API.get(`/report/complaint`);
		const data = resp.data;
		console.log("Resp number of complaint: ", data);
		return data;
	} catch (error) {
		console.error("Error at number of complaint:", error);
		return error.response?.data || null;
	}
};

export const getGender = async () => {
	try {
		const resp = await API.get(`/report/gender`);
		const data = resp.data;
		console.log("Resp gender: ", data);
		return data;
	} catch (error) {
		console.error("Error at gender:", error);
		return error.response?.data || null;
	}
};

export const getKOL = async () => {
	try {
		const resp = await API.get(`/report/kol`);
		const data = resp.data;
		console.log("Resp KOL: ", data);
		return data;
	} catch (error) {
		console.error("Error at KOL:", error);
		return error.response?.data || null;
	}
};