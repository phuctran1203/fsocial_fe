import { create } from "zustand";

export const useSignupStore = create((set) => ({
	form: {
		ten: { value: "", isValid: false, isTouched: false },
		ho: { value: "", isValid: false, isTouched: false },
		day: { value: new Date().getDate(), isValid: true, isTouched: false },
		month: { value: new Date().getMonth(), isValid: true, isTouched: false },
		year: { value: new Date().getFullYear() - 19, isValid: true, isTouched: false },
		gender: { value: 0, isValid: true, isTouched: false },
		username: { value: "", isValid: true, isTouched: false },
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
