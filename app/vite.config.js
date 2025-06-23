import { defineConfig } from 'vite';
import { resolve } from 'path';
import legacy from '@vitejs/plugin-legacy';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import md from 'rollup-plugin-md';
import iifeStr from './plugins/iife-str';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash].[ext]'
      }
    },
    target: 'esnext',
    minify: 'esbuild'
  },
  plugins: [
    iifeStr({ minify: true }),
    md({
      marked: false
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets/**/*',
          dest: 'assets'
        }
      ]
    }),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    extensions: ['.ts', '.mjs', '.js', '.json', '.node']
  },
  define: {
    'process.env': {}
  }
});