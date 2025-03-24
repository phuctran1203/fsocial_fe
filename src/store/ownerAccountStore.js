import { create } from "zustand";

export const ownerAccountStore = create((set) => ({
	user: {
		// id: "",
		// userId: "",
		// firstName: "",
		// lastName: "",
		// avatar: "",
		// banner: "./temp/banner.png",
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
