import API from './axiosInstance';

export const getPolicies = async () => {
	try {
		const resp = await API.get(`/policy`);
		const data = resp.data;
		console.log("Resp policy: ", data);
		return data;
	} catch (error) {
		console.error("Error at policy:", error);
		return error.response?.data || null;
	}
};

export const postPolicies = async (listPolicy) => {

	try {
		const resp = await API.post(`/post/policy`, listPolicy);
		const data = resp.data;
		console.log("Resp post policy: ", data);
		return data;
	} catch (error) {
		console.error("Error at post policy:", error);
		return error.response?.data || null;
	}
};

