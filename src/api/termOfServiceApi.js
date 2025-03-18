import API from "./axiosInstance";

export async function getTermOfService() {
	try {
		const resp = await API.get(`/timeline/term_of_service`);
		const data = resp.data;
		console.log("Term of service: ", data);
		return data;
	} catch (error) {
		console.error("Error at term of service: ", error);
		return error.response?.data || {};
	}
}