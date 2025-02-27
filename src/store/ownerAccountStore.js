import { create } from "zustand";

export const ownerAccountStore = create((set) => ({
	user: {
		id: "",
		userId: "677d104e-e1df-4fdc-8ed3-2ddc34cdced4",
		avatar:
			"https://res.cloudinary.com/dwf2vqohm/image/upload/4280426b-f637-4d22-9aa1-80cf1a711670_hinh-nen-ke-sach.jpg?_a=DAGAACAWZAA0",
		firstName: "",
		lastName: "",
	},

	setUser: (props) =>
		set((state) => ({
			user: {
				...state.user,
				...props,
			},
		})),
}));
