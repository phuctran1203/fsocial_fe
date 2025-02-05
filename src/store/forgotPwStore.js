import { create } from "zustand";

export const useForgotPasswordStore = create((set) => ({
	form: {
		email: { value: "", isValid: false, isTouched: false },
		password: { value: "", isValid: false, isTouched: false },
		rePassword: { value: "", isValid: false, isTouched: false },
	},
	updateField: (id, props) =>
		set((state) => ({
			form: {
				...state.form,
				[id]: { ...state.form[id], ...props },
			},
		})),
}));
