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

	setConversation: (conversation) => set({ conversation }),

	connectMessageWebSocket: (userId) => {
		const { stompClientMessage, setNewMessage } = get();
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

	setSubscription: (conversationId) => {
		const userId = ownerAccountStore.getState().user.userId;
		const { subscription, stompClientMessage, setMessages } = get();
		if (subscription) subscription.forEach((sub) => sub.unsubscribe());

		const subTriggerMessage = stompClientMessage.subscribe(
			`/queue/private-${conversationId}`,
			(message) => {
				const receivedMessage = JSON.parse(message.body);
				if (receivedMessage.receiverId !== userId) return;
				console.log("Trigger message: ", receivedMessage);
				setMessages([...get().messages, receivedMessage]);
			}
		);

		const subTriggerSideAction = stompClientMessage.subscribe(
			`/queue/actions-${conversationId}`,
			(message) => {
				const receivedMessage = JSON.parse(message.body);
				console.log("Trigger side action: ", receivedMessage);
			}
		);

		set({
			subscription: [subTriggerMessage, subTriggerSideAction],
		});
	},

	cleanMessageWebSocket: async () => {
		const { stompClientMessage } = get();
		if (!stompClientMessage) return;
		stompClientMessage.deactivate().then(() => {
			console.log("🚫 Disconnected message socket server");
			set({
				messages: null,
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

	sendSideAction: () => {},

	setNewMessage: (newMessage) => set({ newMessage }),
}));

export default useMessageStore;
