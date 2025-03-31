import { dateTimeToNotiTime } from "@/utils/convertDateTime";
import { Client } from "@stomp/stompjs";
import { create } from "zustand";

const useNotificationsStore = create((set, get) => ({
	unreadCount: 0,
	notifications: null,
	stompClientNotification: null,

	connectNotificationWebSocket: (userId) => {
		const {
			stompClientNotification,
			insertNotifications,
			unreadCount,
			setUnreadCount,
		} = get();
		if (stompClientNotification) return;
		const client = new Client({
			brokerURL: "ws://localhost:8087/notification/ws",
			reconnectDelay: 5000,
			onConnect: () => {
				console.log(
					"Kết nối WebSocket notification, đang lắng nghe trigger global notification"
				);
				client.subscribe(`/topic/notifications-${userId}`, (message) => {
					const receivedMessage = JSON.parse(message.body);
					console.log(
						"Received global trigger notification: ",
						receivedMessage
					);
					insertNotifications(receivedMessage);
					setUnreadCount(unreadCount + 1);
				});
				set({ stompClientNotification: client });
			},
		});
		client.activate();
	},

	cleanNotificationWebSocket: () => {
		const { stompClientNotification } = get();
		if (stompClientNotification)
			return stompClientNotification.deactivate().then(() => {
				console.log("Disconnected notification socket server");
				set({ notifications: null, stompClientNotification: null });
			});
	},

	setNotifications: (allNotifications) =>
		set({ notifications: allNotifications }),

	setUnreadCount: (unreadCount) => set({ unreadCount }),

	updateNotification: (id, props) => {
		const process = get().notifications.map((noti) =>
			noti.id === id ? { ...noti, ...props } : noti
		);
		set({ notifications: process });
	},

	deleteNotification: (id) =>
		set(() => {
			const process = get().notifications.filter((noti) => noti.id !== id);
			return { notifications: process };
		}),

	insertNotifications: (notification) => {
		const { textTime, labelType } = dateTimeToNotiTime(notification.createdAt);
		set({
			notifications: [
				{ ...notification, textTime, labelType },
				...get().notifications,
			],
		});
	},
}));

export default useNotificationsStore;
