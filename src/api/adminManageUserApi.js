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

export const getBanUser = async () => {
	try {
		const resp = await API.get(`/banUser`);
		const data = resp.data;
		console.log("Resp ban manage User: ", data);
		return data;
	} catch (error) {
		console.error("Error at ban manage User:", error);
		return error.response?.data || null;
	}
};

export const getUser = async () => {
	try {
		const resp = await API.get(`/getUser`);
		const data = resp.data;
		console.log("Resp manage User: ", data);
		return data;
	} catch (error) {
		console.error("Error at manage User:", error);
		return error.response?.data || null;
	}
};

export const postManageUser = async (userID) => {
    try {
        const resp = await API.post(`/manageUser/userID=${userID}`);
        const data = resp.data;
        console.log("Resp manage user post: ", data);
        return data;
    } catch (error) {
        console.error("Error at manage user post: ", error);
        return error.response?.data || null;
    }
};

export const searchManageUser = async (keyword) => {
	try {
		const resp = await API.get(`/manageUser/find?find_name=${keyword}`);
		const data = resp.data;
		console.log("Resp search manage user: ", data);
		return data;
	} catch (error) {
		console.error("Error at search manage user:", error);
		return error.response?.data || null;
	}
};