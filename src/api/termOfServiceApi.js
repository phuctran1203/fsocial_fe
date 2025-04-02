import API from "./axiosInstance";

export async function getTermOfService() {
	try {
		const resp = await API.get(`/timeline/term_of_service`);
		return resp.data;
	} catch (error) {
		console.error("Error at term of service: ", error);
		return error.response?.data || null;
	}
}

export const removeTermOfService = async (id) => {
	try {
		const resp = await API.delete(`/post/term_of_service?term_id=${id}`);
		return resp.data;
	} catch (error) {
		console.error("Error at delete term of service: ", error);
		return error.response?.data || null;
	}
};

export const addTermOfService = async (name) => {
	try {
		const resp = await API.post(`/post/term_of_service`, { name: `${name}` });
		return resp.data;
	} catch (error) {
		console.error("Error at delete term of service: ", error);
		return error.response?.data || null;
	}
};
