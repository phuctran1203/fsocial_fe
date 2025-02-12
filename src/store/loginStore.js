import { create } from "zustand";

export const useLoginStore = create((set) => ({
	form: {
		loginName: { value: "", isValid: false, isTouched: false },
		password: { value: "", isValid: false, isTouched: false },
		// rePassword: { value: "", isValid: false, isTouched: false },
	},
	updateField: (id, props) =>
		set((state) => ({
			form: {
				...state.form,
				[id]: { ...state.form[id], ...props },
			},
		})),
}));
