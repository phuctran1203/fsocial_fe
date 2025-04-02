import { Client } from "@stomp/stompjs";
import { create } from "zustand";
import { ownerAccountStore } from "./ownerAccountStore";

const useSideActionMessageStore = create((set, get) => ({
	stompClientSideAction: null,
	subscription: null,

	connectSideActionMessageWebSocket: () => {
		const { stompClientSideAction } = get();
		if (stompClientSideAction) return;
		const client = new Client({
			brokerURL: "ws://localhost:8082/chat.actions",
			reconnectDelay: 10000,
			onConnect: () => {
				console.log("Kết nối WebSocket side action message");
				set({ stompClientSideAction: client });
			},
		});

		client.activate();
	},

	setSubscriptionSideActionMessage: (conversationId) => {
		const userId = ownerAccountStore.getState().user.userId;
		const { subscription, stompClientSideAction } = get();
		if (subscription) subscription.unsubscribe();
		set({
			subscription: stompClientSideAction.subscribe(
				`/queue/actions-${conversationId}`,
				(message) => {
					const receivedMessage = JSON.parse(message.body);
					console.log("trigger side action message: ", receivedMessage);
				}
			),
		});
	},

	cleanSideActionMessageWebSocket: async () => {
		const { stompClientSideAction } = get();
		if (!stompClientSideAction) return;
		stompClientSideAction.deactivate().then(() => {
			console.log("🚫 Disconnected side action message socket server");
			set({
				stompClientSideAction: null,
				subscription: null,
			});
		});
	},
}));

export default useSideActionMessageStore;
