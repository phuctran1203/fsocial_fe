import API from './axiosInstance';

export const getProfile = async (userId) => {

	try {
		const resp = await API.get(`/profile/profile-admin/${userId}/other`);
		const data = resp.data;
		console.log("Resp profile: ", data);
		return data;
	} catch (error) {
		console.error("Error at profile:", error);
		return error.response?.data || null;
	}
};
