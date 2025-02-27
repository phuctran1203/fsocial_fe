import { create } from "zustand";

export const popupCommentStore = create((set) => ({
	id: null,
	isVisible: false,
	setId: (id) => set({ id }),
	setIsVisible: (value) => set({ isVisible: value }),
}));

export const popupCreatePostStore = create((set) => ({
	isVisible: false,
	setIsVisible: (value) => set({ isVisible: value }),
}));

export const popupNotificationtStore = create((set) => ({
	isVisible: false,
	setIsVisible: (value) => set({ isVisible: value }),
}));

export const popupExpandNoti3DotStore = create((set) => ({
	idNotiShowing: null,
	setIdNotiShowing: (value) =>
		set(() => ({
			idNotiShowing: value,
		})),
}));

export const popupReportPostStore = create((set) => ({
	id: null,
	isVisible: false,
	setId: (id) => set({ id }),
	setIsVisible: (value) => set({ isVisible: value }),
}));

export const popupEditPostStore = create((set) => ({
	id: null,
	isVisible: false,
	setId: (id) => set({ id }),
	setIsVisible: (value) => set({ isVisible: value }),
}));

export const popupDeletePostStore = create((set) => ({
	id: null,
	isVisible: false,
	setId: (id) => set({ id }),
	setIsVisible: (value) => set({ isVisible: value }),
}));
