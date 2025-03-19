import API from './axiosInstance';

export const getManageUser = async () => {
	try {
		const resp = await API.get(`/manageUser`);
		const data = resp.data;
		console.log("Resp manageUser: ", data);
		return data;
	} catch (error) {
		console.error("Error at manageUser:", error);
		return error.response?.data || null;
	}
};

export const postManageUser = async (userID) => {
    try {
        const resp = await API.post(`/manageUser/userID=${userID}`, dataObj);
        const data = resp.data;
        console.log("Resp manage user post: ", data);
        return data;
    } catch (error) {
        console.error("Error at manage user post: ", error);
        return error.response?.data || null;
    }
};