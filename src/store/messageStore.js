import { create } from "zustand";
import { Client } from "@stomp/stompjs";

const useMessageStore = create((set, get) => ({
	messages: [],
	conversation: null,
	stompClient: null,
	subscription: null,
	newMessage: null,

	setMessages: (messages) => set({ messages }),

	setConversation: (conversation) => set({ conversation }),

	connectWebSocket: () => {
		const { stompClient } = get();
		if (stompClient) return;

		const client = new Client({
			brokerURL: "ws://localhost:8082/message/ws",
			reconnectDelay: 10000,
			onConnect: () => {
				console.log("🔗 Kết nối WebSocket message!");
				set({ stompClient: client });
			},
		});

		client.activate();
	},

	sendMessage: (content, id) => {
		const { stompClient, conversation } = get();
		if (!stompClient?.connected || !conversation) return;

		stompClient.publish({
			destination: "/app/chat.private",
			body: JSON.stringify({
				receiverId: conversation.receiverId,
				conversationId: id ?? conversation.id,
				content: content,
			}),
		});
	},

	setSubscription: (userId) =>
		set(() => {
			const { stompClient, setNewMessage } = get();
			return {
				subscription: stompClient.subscribe(
					`/queue/private-${userId}`,
					(message) => {
						const receivedMessage = JSON.parse(message.body);
						console.log("received global trigger: ", receivedMessage);
						// tạo zustand, lưu trigger new message cho navBar và useEffect cho Message.jsx
						setNewMessage(receivedMessage);
					}
				),
			};
		}),

	subscribeMessageGlobal: (userId) => {
		const { subscription, setSubscription } = get();
		if (subscription) return;
		setSubscription(userId);
	},

	setNewMessage: (newMessage) => set({ newMessage }),
}));

export default useMessageStore;
