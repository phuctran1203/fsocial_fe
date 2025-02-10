import { create } from "zustand";

export const ownerAccountStore = create((set) => ({
	user: {
		id: "12345",
		avatar: "user_1.png",
		displayName: "Phúc Trần",
	},
	setUser: (user) => set({ user }),
}));
