import { ownerAccountStore } from "@/store/ownerAccountStore";
import API from "./axiosInstance";
import axios from "axios";

export async function getConversations() {
	const user = ownerAccountStore.getState().user;
	const userId = user.userId;
	try {
		const resp = await API.get(`/message/conversations/user/${userId}`);
		const data = resp.data;
		console.log("Resp getConversations: ", data);
		return data;
	} catch (error) {
		console.error("Error at getConversations: ", error);
		return error.response?.data || null;
	}
}

export async function getMessages(conversationId, controller) {
	try {
		const resp = await API.get(
			`/message/messages/${conversationId}`,
			controller && { signal: controller.signal }
		);
		const data = resp.data;
		console.log("Resp getMessages: ", data);
		return data;
	} catch (error) {
		if (error.name === "CanceledError") return null;
		console.error("Error at getMessages: ", error);
		return error.response?.data || null;
	}
}

export async function createConversation(receiverId) {
	const user = ownerAccountStore.getState().user;
	const senderId = user.userId;
	const dataSending = {
		senderId,
		receiverId,
	};
	try {
		const resp = await API.post(`/message/conversations`, dataSending);
		const data = resp.data;
		console.log("Resp createConversation: ", data);
		return data;
	} catch (error) {
		console.error("Error at createConversation: ", error);
		return error.response?.data || null;
	}
}
