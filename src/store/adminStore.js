// import { Avatar } from "@radix-ui/react-avatar";
import { create } from "zustand";

export const adminStore = create((set) => ({
  form: {
    ten: { value: "", isValid: false, isTouched: false },
    ho: { value: "", isValid: false, isTouched: false },
    day: { value: new Date().getDate(), isValid: true, isTouched: false },
    month: { value: new Date().getMonth(), isValid: true, isTouched: false },
    year: {
      value: new Date().getFullYear() - 19,
      isValid: true,
      isTouched: false,
    },
    gender: { value: "string", isValid: true, isTouched: false },
    username: { value: "", isValid: true, isTouched: false },
    email: { value: "", isValid: false, isTouched: false },
    oldPassword: { value: "", isValid: false, isTouched: false },
    newPassword: { value: "", isValid: false, isTouched: false },
    confirmPassword: { value: "", isValid: false, isTouched: false },
    avatar: "./temp/default_avatar.svg",
  },
  updateField: (id, props) =>
    set((state) => ({
      form: {
        ...state.form,
        [id]: { ...state.form[id], ...props },
      },
    })),
}));
