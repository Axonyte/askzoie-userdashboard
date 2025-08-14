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
        lib: {
            entry: path.resolve(__dirname, "src/index.tsx"),
            name: "AskBot",
            fileName: (format) => `askbot.${format}.js`,
            formats: ["es", "umd"], // ES module & UMD for script tag support
        },
        rollupOptions: {
            // Prevent bundling React & others
            external: ["react", "react-dom", "csso"],
            output: {
                manualChunks: undefined, // Single file output
                entryFileNames: "askbot.[format].js",
                assetFileNames: "askbot.[ext]",
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                    csso: "csso",
                },
            },
        },
    },
});
