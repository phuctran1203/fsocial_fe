import API from "./axiosInstance";

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

export const getNumberOfComplaint = async (startDate, endDate) => {
	let endpoint;

	if (startDate && endDate)
		endpoint = `/timeline/complaint/statistics_complaint_start_end?startDate=${startDate}&endDate=${endDate}`;
	else if (startDate)
		endpoint = `/timeline/complaint/statistics_complaint_today?date_time=${startDate}`;
	console.log(endpoint);
	try {
		const resp = await API.get(endpoint);
		const data = resp.data;
		console.log("Resp getNumberOfComplaint: ", data);
		return data;
	} catch (error) {
		console.error("Error at getNumberOfComplaint:", error);
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
