// import { Avatar } from "@radix-ui/react-avatar";
import { create } from "zustand";

export const adminStore = create((set) => ({
	form: {
		ten: { value: "Minh", isValid: false, isTouched: false },
		ho: { value: "Tiến", isValid: false, isTouched: false },
		day: { value: 11, isValid: true, isTouched: false },
		month: { value: "03", isValid: true, isTouched: false },
		year: {
			value: 1999,
			isValid: true,
			isTouched: false,
		},
		gender: { value: 0, isValid: true, isTouched: false },
		username: { value: "minhtien01", isValid: true, isTouched: false },
		email: { value: "tien@gmail.com", isValid: false, isTouched: false },
		oldPassword: { value: "", isValid: false, isTouched: false },
		newPassword: { value: "", isValid: false, isTouched: false },
		confirmPassword: { value: "", isValid: false, isTouched: false },
		avatar: { value: "../temp/default_avatar.svg" },
	},
	updateField: (id, props) =>
		set((state) => ({
			form: {
				...state.form,
				[id]: { ...state.form[id], ...props },
			},
		})),
}));
