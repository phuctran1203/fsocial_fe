// import { Avatar } from "@radix-ui/react-avatar";
import { create } from "zustand";

export const adminStore = create((set) => ({
	user: {
		firstName: "Minh",
		lastName: "Tiến",
		day: 11,
		month: "03",
		year: 1999,
		gender: 0,
		username: "minhtien01",
		email: "tien@gmail.com",
		avatar: "../temp/default_avatar.svg",
	},

	setUser: (props) =>
		set((state) => ({
			user: {
				...state.user,
				...props,
			},
		})),

	resetUser: () => set({ user: {} }),
}));
