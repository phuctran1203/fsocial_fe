import { create } from "zustand";
import { Client } from "@stomp/stompjs";
import { ownerAccountStore } from "./ownerAccountStore";

const useMessageStore = create((set, get) => ({
	messages: null,
	conversation: null,
	stompClientMessage: null,
	subscription: null,
	newMessage: null,

	setMessages: (messages) => set({ messages }),

	setSubscription: (conversationId) => {
		const userId = ownerAccountStore.getState().userId;
		const { subscription, stompClientMessage } = get();
		if (subscription) subscription.unsubscribe();
		set({
			subscription: stompClientMessage.subscribe(
				`/queue/private-${conversationId}`,
				(message) => {
					const receivedMessage = JSON.parse(message.body);
					console.log("received trigger: ", receivedMessage);
					if (receivedMessage.receiverId !== userId) return;
					setMessages([...[get().messages || []], receivedMessage]);
				}
			),
		});
	},

	setConversation: (conversation) => set({ conversation }),

	connectMessageWebSocket: (userId) => {
		const { stompClientMessage } = get();
		if (stompClientMessage) return;

		const client = new Client({
			brokerURL: "ws://localhost:8082/message/ws",
			reconnectDelay: 10000,
			onConnect: () => {
				console.log(
					"Kết nối WebSocket message, đang lắng nghe trigger global message"
				);
				client.subscribe(`/queue/private-${userId}`, (message) => {
					const receivedMessage = JSON.parse(message.body);
					console.log("Received global trigger message: ", receivedMessage);
					// trigger new message cho navBar và useEffect cho Message.jsx
					setNewMessage(receivedMessage);
				});
				set({ stompClientMessage: client });
			},
		});

		client.activate();
	},

	cleanMessageWebSocket: async () => {
		const { stompClientMessage } = get();
		if (stompClientMessage)
			return stompClientMessage.deactivate().then(() => {
				console.log("🚫 Disconnected message socket server");
				set({
					messages: [],
					conversation: null,
					stompClientMessage: null,
					subscription: null,
					newMessage: null,
				});
			});
	},

	sendMessage: (content, id) => {
		const { stompClientMessage, conversation } = get();
		if (!stompClientMessage?.connected || !conversation) return;

		stompClientMessage.publish({
			destination: "/app/chat.private",
			body: JSON.stringify({
				receiverId: conversation.receiverId,
				conversationId: id ?? conversation.id,
				content: content,
			}),
		});
	},
	setNewMessage: (newMessage) => set({ newMessage }),
}));

export default useMessageStore;
