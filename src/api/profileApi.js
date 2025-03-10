import { ownerAccountStore } from "@/store/ownerAccountStore";
import API from "./axiosInstance";

export async function getOwnerProfile(controller) {
	const userId = ownerAccountStore.getState().user.userId;
	try {
		const resp = await API.get(`/profile/`, controller && { signal: controller.signal });
		const data = resp.data;
		console.log("Resp getOwnerProfile: ", data);
		return data;
	} catch (error) {
		if (error.name === "CanceledError") return null;
		console.error("Error at getOwnerProfile: ", error);
		return error.response?.data || {};
	}
}

export async function getProfile(userId) {
	try {
		const resp = await API.get(`/profile/${userId}`);
		const data = resp.data;
		console.log("Resp getProfile: ", data);
		return data;
	} catch (error) {
		console.error("Error at getProfile: ", error);
		return error.response?.data || {};
	}
}
