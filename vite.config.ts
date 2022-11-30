import { defineConfig, searchForWorkspaceRoot } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  base: "./",
  build: {
    outDir: "build"
  },
  server: {
    fs: {
      allow: [
        searchForWorkspaceRoot(
          process.cwd().replace("instant-apps-boilerplate", "")
        )
      ]
    },
    port: 3000
  }
});
