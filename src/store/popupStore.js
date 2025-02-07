import { create } from "zustand";

export const popupCreatePostStore = create((set) => ({
	isVisible: false,
	setIsVisible: (value) =>
		set(() => ({
			isVisible: value,
		})),
}));

export const popupNotificationtStore = create((set) => ({
	isVisible: false,
	setIsVisible: (value) =>
		set(() => ({
			isVisible: value,
		})),
}));
