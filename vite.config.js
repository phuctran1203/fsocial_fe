import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import removeConsole from "vite-plugin-remove-console";
import path from "node:path";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
	plugins: [
		react(),
		removeConsole({
			exclude: ["error", "warn"], // Giữ lại console.error và console.warn
		}),
		createHtmlPlugin({
			minify: true, // Tự động minify HTML
			transformHtml: (html) =>
				html
					.replace(/<!--[\s\S]*?-->/g, "") // Xóa comment HTML <!-- -->
					.replace(/\/\/[^\n\r]*/g, ""), // Xóa comment kiểu // trong script
		}),
	],
	// cần đoạn này để cài shadcn
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	server: {
		host: "0.0.0.0", // Lắng nghe trên tất cả các địa chỉ IP
		port: 3000,
	},
});
