import axios from "axios";
import API from "./axiosInstance";

export async function getNotification(userId) {
	try {
		const resp = await API.get(`/notification/notice/${userId}`);
		const data = resp.data;
		console.log("Resp getNotification: ", data);
		return data;
	} catch (error) {
		console.error("Error at getNotification: ", error);
		return error.response?.data || null;
	}
}
