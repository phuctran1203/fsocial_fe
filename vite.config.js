import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	base: "/fsocial_fe/",
	server: {
		host: "0.0.0.0", // Lắng nghe trên tất cả các địa chỉ IP
		port: 3000,
	},
});
