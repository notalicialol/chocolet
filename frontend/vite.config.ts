import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export default defineConfig({
    plugins: [react()],
    define: {
        "import.meta.env": Object.fromEntries(Object.entries(process.env).map(([key, value]) => [`VITE_${key}`, value]))
    },
    resolve: {
        alias: {
            "@types": "/src/types",
            "@pages": "/src/pages",
            "@routes": "/src/routes",
            "@components": "/src/components",
            "@controllers": "/src/controllers",
            "@stores": "/src/stores",
            "@styles": "/src/styles"
        }
    },
    server: {
        port: Number(process.env.VITE_FRONTEND_PORT),
        proxy: {
            "/api": {
                target: process.env.VITE_BACKEND_URL,
                changeOrigin: true,
                ws: true
            }
        }
    },
    css: {
        modules: {
            scopeBehaviour: "local",
            localsConvention: "camelCaseOnly",
            generateScopedName: "[name]__[local]___[hash:base64:5]"
        },
        preprocessorOptions: {
            scss: {
                additionalData: "@import \"./src/styles/variables.scss\";"
            }
        }
    },
    build: {
        target: "es2022",
        outDir: "./dist",
        rollupOptions: {
            output: {
                manualChunks: (id: string) => {
                    if (id.includes("node_modules")) return "vendor";
                    else return "main";
                },
                chunkFileNames: "[name].[hash].js",
                entryFileNames: "[name].[hash].js",
                assetFileNames: "[name].[hash].[ext]"
            }
        },
        chunkSizeWarningLimit: 1000,
        manifest: true,
        minify: "terser",
        terserOptions: {
            format: {
                comments: false
            },
            compress: {
                sequences: true,
                booleans: true,
                loops: true,
                toplevel: true,
                unsafe: true,
                drop_console: true,
                unsafe_comps: true,
                passes: 2
            },
            module: true
        }
    }
});