import { create } from "zustand";

export const useChangePasswordModalStore = create((set) => ({
    form: {
        oldPassword: { value: "", isValid: false, isTouched: false },
        newPassword: { value: "", isValid: false, isTouched: false },
        reNewPassword: { value: "", isValid: false, isTouched: false },
    },
    updateField: (id, props) =>
        set((state) => ({
            form: {
                ...state.form,
                [id]: { ...state.form[id], ...props },
            },
        })),
    getFormData: () => {
        let data = Object.keys(useChangePasswordModalStore.getState().form)
            .filter((key) => key != "newPassword")
            .reduce((acc, key) => {
                acc[key] = useChangePasswordModalStore.getState().form[key].value;
                return acc;
            }, {});
        return data;
    },
}));
