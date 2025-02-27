import { create } from "zustand";
import { persist } from "zustand/middleware";

export const themeStore = create(
	persist(
		(set) => ({
			theme: "light", // Giá trị mặc định
			setTheme: (value) => set({ theme: value }),
		}),
		{
			name: "theme", // Key lưu trong localStorage
		}
	)
);
