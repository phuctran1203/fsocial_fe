import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import removeConsole from "vite-plugin-remove-console";

export default defineConfig({
	plugins: [
		react(),
		removeConsole({
			exclude: ["error", "warn"], // Giữ lại console.error và console.warn
		}),
	],
	base: "/fsocial_fe/",
	server: {
		host: "0.0.0.0", // Lắng nghe trên tất cả các địa chỉ IP
		port: 3000,
	},
});
