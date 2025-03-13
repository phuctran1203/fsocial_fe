import { create } from "zustand";

export const popupNotificationtStore = create((set) => ({
	isVisible: false,
	setIsVisible: (value) => set({ isVisible: value }),
}));

export const popupExpandNoti3DotStore = create((set) => ({
	idNotiShowing: null,
	setIdNotiShowing: (value) => set({ idNotiShowing: value }),
}));

export const popupDeletePostStore = create((set) => ({
	id: null,
	isVisible: false,
	setId: (id) => set({ id }),
	setIsVisible: (value) => set({ isVisible: value }),
}));

export const usePopupStore = create((set) => ({
	heading: null,
	isOpen: false,
	children: null,
	showPopup: (heading, children) => set({ isOpen: true, heading, children }),
	hidePopup: () => {
		set({ isOpen: false });
		setTimeout(() => {
			set({ heading: null, children: null });
		}, 50);
	},
}));
