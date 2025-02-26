import { ownerAccountStore } from "@/store/ownerAccountStore";
import API from "./axiosInstance";

export async function getOwnerProfile() {
	const userId = ownerAccountStore.getState().user.userId;
	try {
		const resp = await API.get(`/profile/${userId}`);
		const data = resp.data;
		console.log("Resp getOwnerProfile: ", data);
		return data;
	} catch (error) {
		console.log("Error at getOwnerProfile: ", error);
		return error.response?.data || {};
	}
}
