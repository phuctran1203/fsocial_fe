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

export const popupStore = create((set) => ({
	isVisible: false,
	setIsVisible: (value) => set({ isVisible: value }),
}));

export const usePopupStore = create((set) => ({
	popupHeading: null,
	isOpen: false,
	children: null,
	className: null,
	showPopup: (popupHeading, children, className) => set({ isOpen: true, popupHeading, children, className }),
	hidePopup: () => set({ isOpen: false, popupHeading: null, children: null, className: null }),
}));
