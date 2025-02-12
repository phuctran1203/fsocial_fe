import { create } from "zustand";

export const popupCommentStore = create((set) => ({
	isVisible: false,
	id: null,
	setIsVisible: (value) => set({ isVisible: value }),
	setId: (id) => set({ id }),
}));

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

export const popupExpandNoti3DotStore = create((set) => ({
	idNotiShowing: null,
	setIdNotiShowing: (value) =>
		set(() => ({
			idNotiShowing: value,
		})),
}));
