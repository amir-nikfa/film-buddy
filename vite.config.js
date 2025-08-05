import { defineConfig } from "vite";
import path from "path";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
	root: "src",
	envDir: path.resolve(__dirname),
	build: {
		outDir: "../dist",
		emptyOutDir: true,
		minify: "terser",
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
			},
			format: {
				comments: false,
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	plugins: [
		createHtmlPlugin({
			minify: true,
		}),
	],
});
