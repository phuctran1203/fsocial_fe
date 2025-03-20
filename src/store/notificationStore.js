import { dateTimeToNotiTime } from "@/utils/convertDateTime";
import { create } from "zustand";

export const useNotificationsStore = create((set, get) => ({
	notifications: null,

	setNotifications: (allNotifications) =>
		set({ notifications: allNotifications }),

	updateNotification: (id, props) =>
		set(() => {
			const process = get().notifications.map((noti) =>
				noti.id === id ? { ...noti, ...props } : noti
			);
			return { notifications: process };
		}),

	deleteNotification: (id) =>
		set(() => {
			const process = get().notifications.filter((noti) => noti.id !== id);
			return { notifications: process };
		}),

	insertNotifications: (notification) =>
		set(() => {
			const { textTime, labelType } = dateTimeToNotiTime(
				notification.createdAt
			);
			return {
				notifications: [
					{ ...notification, textTime, labelType },
					...get().notifications,
				],
			};
		}),
}));
