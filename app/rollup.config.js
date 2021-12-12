import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
// import html from '@rollup/plugin-html';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import html from '@web/rollup-plugin-html';
import copy from 'rollup-plugin-copy';
import dev from 'rollup-plugin-dev';
import css from "rollup-plugin-import-css";
import livereload from 'rollup-plugin-livereload';
import md from 'rollup-plugin-md';
import { terser } from 'rollup-plugin-terser';
import iifeStr from './plugins/iife-str';

const extensions = ['.ts', '.mjs', '.js', '.json', '.node'];

/** @type {import('rollup-plugin-copy').CopyOptions} */
const copyConfig = {
  targets: [{ src: 'src/assets/**/*', dest: 'dist/assets' }],
};

/** @type {import('rollup').RollupOptions} */
const config = {
  input: ['./src/app.ts'],
  output: {
    dir: 'dist',
    format: 'es',
    name: 'Bonelli',
    entryFileNames: '[name].[hash].js',
    chunkFileNames: '[name].[hash].js',
  },
  plugins: [
    nodeResolve({ extensions, browser: true, preferBuiltins: true }),
    iifeStr({ minify: true }),
    commonjs(),
    md({
      marked: false
    }),
    css(),
    json(),
    html({
      input: './src/index.html',
      minify: true,
    }),
    copy(copyConfig),
    babel({
      extensions,
      babelHelpers: 'bundled',
      include: ['src/**/*'],
    }),
  ],
};
const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
  config.watch = {};
  config.output.sourcemap = true;
  config.plugins = [
    ...config.plugins,
    dev({ dirs: ['dist'], spa: './index.html' }),
    livereload({
      watch: ['dist'],
    }),
  ];
}

if (!isDevelopment) {
  config.output.sourcemap = false;
  config.plugins = [...config.plugins, terser({})];
}

export default config;
