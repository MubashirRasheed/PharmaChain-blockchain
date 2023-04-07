import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import * as esbuild from "esbuild";
import fs from "node:fs";

// https://vitejs.dev/config/

// const rollupPlugin = (matchers) => ({
//   name: "js-in-jsx",
//   load(id) {
//     if (matchers.some(matcher => matcher.test(id))) {
//       const file = fs.readFileSync(id, { encoding: "utf-8" });
//       return esbuild.transformSync(file, { loader: "jsx" });
//     }
//   }
// });

export default defineConfig({
  plugins: [react(),
  
    {
        name: 'load-js-files-as-jsx',
        async load(id) {
            if (!id.match(/src\/.*\.js$/)) {
                return
            }

            const file = fs.readFileSync(id, { encoding: "utf-8" });
            return esbuild.transformSync(file, { loader: 'jsx' })
        }
    }
],
esbuild: {
    // add this configuration object for the jsx loader
    loader: {
      '.js': 'jsx'
    }
  }
})

