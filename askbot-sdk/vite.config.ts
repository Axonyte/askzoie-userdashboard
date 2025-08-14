import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		target: "es2017",
		cssCodeSplit: false,
		minify: "esbuild",
		sourcemap: false,
		rollupOptions: {
			output: {
				manualChunks: undefined, // Disable code-splitting → single file output
				entryFileNames: "askbot.js", // Name of the final file
				assetFileNames: "askbot.[ext]", // Optional: control asset naming
			},
		},
	},
});
