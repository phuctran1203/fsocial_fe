import { ownerAccountStore } from "@/store/ownerAccountStore";
import API from "./axiosInstance";
import axios from "axios";

export async function getMessages(receiverId) {
	const user = ownerAccountStore.getState().user;
	const senderId = user.userId;
	try {
		const resp = await API.get(`/message/chat/${senderId}/${receiverId}`);
		const data = resp.data;
		console.log("Resp getMessages: ", data);
		return data;
	} catch (error) {
		console.error("Error at getMessages: ", error);
		return error.response?.data || [];
	}
}
