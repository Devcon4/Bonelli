# Build tool basics: Rollup
---
## Primer
Bundling is an important part of any modern website, but it can be quite hard to wrap your head around what exactly happens to your source code when you make a production build. Lets take a look at build tools and bundling in general then setup a simple Rollup config to bundle a Typescript project.

## How did we get here?
In the distant past websites use to just be a collection of html with maybe a few scripts with nothing really special going on. As people started adding more and more Javascript to websites and with the idea of SPA apps on the rise everyone started to pay more attention to what exactly they sent to the client. People started to care more about compressing their Javascript to be as small as possible, stripping out whitespace, using modules, and many other techniques. Transpiling with languages like Typescript and SCSS hit the mainstream along with using Babel to Polyfill new Javascript features into older browsers. Nowadays your source code will almost definitely look way different from your production code. This lead to the need for tools to do all of this work for us and create an optimized bundle to send to users.

## What exactly is a bundler?
In the most basic sense a bundler takes your Javascript, figures out all of the dependencies, then applies transformations to them. Bundlers can do a lot more but at their core this is what all bundlers do. The main bundlers used nowadays are `Webpack`, `Parcel`, and `Rollup`. 
There is a great project called [Tooling Report](https://bundlers.tooling.report/) which has a breakdown and comparison of various bundlers and the features they support you should checkout! Framework CLI tools like `@angular/cli`, `create-react-app`, or `@vue/cli` hide the bundler behind their CLI so you don't have to worry about it as much. Some other tools that are worth mentioning are `Snowpack` and `Vite`. Figuring out dependencies and linking them is actually is a complex topic with a storied history in Javascript though.

## Javascript Modules
Here is a quick summary of the different module systems for Javascript that have existed over the years. I won't go into much detail but feel free to look them up.

IIFE (Immediately-Invoked Function Expression): This is one of the first module patterns. They still have their place but people stopped using it as a module system.

CommonJS: The next main module system came out with the advent of NodeJS. This is where node_modules came from. The `module.exports` or `require("someModule")` syntax began here. CommonJS always had problems running in browsers though and only was used for back-end code.

AMD (Asynchronous Module Definition): This one was short lived. It was created by RequireJS to bring modules to the front-end. This one uses `define("moduleName", ["dep1", "dep2"], function(){/* do stuff */})` syntax.

UMD (Universal Module Definition): This combines CommonJS and AMD into one system that can work on both nodeJS and Browsers. If you use Webpack or are building to a browser you will probably see this system used. Most of the time when people mention CommonJS nowadays they actually are talking about UMD. They have basically become synonymous because it is rare to build only for CommonJS.

ESM: This is the new shinny ESModule system that has been officially adopted by Javascript. You should try to use this system wherever possible, although UMD is still kinda common to see as people transition. This introduced the `import { foo } from 'bar';` syntax.

If all that sounds confusing don't worry! In practice it's not too important that we know how they work but rather just that they exist. Now that we have that out of the way lets take a look at Rollup specifically and how we can use it.

## Rollup
As mentioned Rollup is a Module Bundler similar to Webpack. It has become very popular if you want to output `esm`, are sick of how complicated Webpack can become, or are upgrading from a 'zero-config' bundler like Parcel. The main selling points of Rollup is it's simplified Plugin architecture and `esm` first approach. Lets walk through how to setup Rollup for a Typescript Node project that you could reuse for other projects. I currently have a Template repo in Github called [Cardinal](https://github.com/Devcon4/Cardinal) which I use to scaffold new projects which we will be recreate.

---
## Creating our Project

First lets start by making a new git repo (either clone a blank repo or run `git init`) and running `npm init` to setup our `package.json` file. We are going to setup Typescript with babel using the preset-typescript plugin so lets install some packages.

```
npm i -D rollup typescript core-js @babel/core @babel/preset-env @babel/preset-typescript
```

To finish with the basic structure of the project lets make a `src` folder and a `.gitignore` file.

*.gitignore*

```
/dist
/node_modules
```

## Setup babelrc and tsconfig
For babel and typescript we need to setup some config files, the first is a `.babelrc`. This file tells babel what plugins to load, what environment to build for, and what version of Javascript it should target. We will also need a few more plugins installed so run `npm i -D @babel/plugin-proposal-decorators @babel/proposal-class-properties @babel/proposal-object-rest-spread`. Typescript implements some features (like Decorators) which have not been added to Javascript yet, these plugins tell babel how to convert those. Now lets write our file.

*.babelrc*
```
{
    "presets": [
      ["@babel/env", {
        "useBuiltIns": "usage",
        "corejs": 3,
        "targets": "> 5.0%, not dead"
      }],
      "@babel/typescript" 
    ],
    "plugins": [
      ["@babel/plugin-proposal-decorators", {"decoratorsBeforeExport": true}],
      ["@babel/proposal-class-properties"],
      "@babel/proposal-object-rest-spread"
    ]
  }
```

Take a look at the line `targets > 5.0%, not dead`. It is how babel figures out what version of Javascript to build. Targets is referencing browser versions, so `>5.0%` means target browser versions whos global user base is larger than 5%. Pretty cool huh? Next lets write our `tsconfig.json` file. This should look pretty standard to anyone who has done Typescript before.

*tsconfig.json*
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "baseUrl": ".",
    "resolveJsonModule": true,
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "declaration": true,
    "strict": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "lib": ["ESNext"]
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "src/**/*.spec.*"
  ]
}
```

Nothing too special here although our target and module is `ESNext` which may change for different projects.

## Rollup config
Now lets finally dig into writing our `rollup.config.js`. Rollup configs have three main parts `input`, `output`, and `plugins`. There is more stuff you can edit but these are the only ones we care about most of the time. Lets begin our file with exporting a basic config.

*rollup.config.js*
```javascript

/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'src/app.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    name: '<your project name>'
  },
  plugins: []
};

export default config;
```

The first weird thing is that comment. It's not required or specific to Rollup or anything but rather is just a jsdoc comment that specifies the type for the config object to be `RollupOptions`. Because this config is a js file and not ts we don't get any typing, but our IDE can infer the type based on this comment and fake it. This is super useful for config files and I recommend you add them.

Next we have our input which tells Rollup what our entrypoint for the project is and our output which specifies how we want our javascript to end up as. We tell rollup to put our bundled js in our `dist` folder and that we want it in the `esm` module format. It is out of scope of this project but I would recommend setting `chunkFileNames` to break up your bundle into smaller bits that could be loaded asynchronously. 

Lets add some plugins to our config file.

## Rollup plugins
One of the strong points of rollup is it's plugin architecture. A subtle but important difference with Rollup vs Webpack is how their docs teach you. Webpack for the most part teaches how to do something. For example if you want to bundle HTML the docs tell you what plugins to install to do that. Rollup in contrast teaches you how Rollup works. It explains how to create new plugins simply and how it transforms code. In my experience this makes rollup easier to understand than webpack and less magical.

We now need a few plugins to get our build working. Remember how I mentioned we are in a transition period from Commonjs style node modules to ESM style ones? Well because Rollup is designed for ESM we need to tell it how to load these older format modules. Lets install some more plugins `npm i -D @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-babel @rollup/plugin-run rollup-plugin-terser` and update our config to use them.

```javascript
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import run from '@rollup/plugin-run';
import {terser} from 'rollup-plugin-terser';

const extensions = ['.js', '.ts'];

/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'src/app.ts',
  output: {
      dir: 'dist',
      format: 'esm',
      name: '<your project name>'
  },
  
  plugins: [
    resolve({ extensions }),
    commonjs(),
    babel({
      extensions,
      babelHelpers: 'bundled',
      include: ['src/**/*'],
    }),
  ],
}

const isWatching = process.env.ROLLUP_WATCH === 'true';
const isDevelopment = process.env.NODE_ENV === 'development';

if(isDevelopment) {
  config.plugins = [
    ...config.plugins,
    isWatching && run({})
  ];
}

if (!isDevelopment) {
  config.plugins = [
    ...config.plugins,
    terser({}),
  ];
}

export default config;
```

The first plugin is `resolve` which replaces node_module imports with file paths (`import { LitElement } from 'lit-element'` becomes `import { LitElement } from './node_modules/lit-element/lit-element.js'`). Next we use `commonjs` to turn commonjs modules to esm compatible ones, not all of the libraries we use have updated to esm modules yet so this plugin allows us to still use them. Lastly we setup `babel` which will turn our typescript into javascript, add polyfils, and transform our javascript to the target version.

There is also some extra config at the bottom. If we are running in watch mode in develop we add the `run` plugin which will run our bundle after it is built which is useful for node projects. We also add the `terser` plugin if this is a production build which will minify/uglify our javascript so it's much smaller.

Hopefully rollup look less scary now, overall it is very flexible. If this was a front-end project we would have some different plugins like `@rollup/plugin-html` or `rollup-plugin-dev` to build our html and run a dev server locally.

## Testing
The last thing I want to configure is Jest for running unit tests. In this setup though Jest ignores our rollup config and will build our typescript itself but that shouldn't be a big deal. Lets install some packages `npm i -D jest ts-jest @types/jest` and write our file.

*jest.config.js*

```javascript
/** @type {import('@jest/types/build/Config').DefaultOptions} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};

export default config;
```

Again we are using that jsdoc trick to type our jest config file. We tell jest to use ts-jest so we can write our tests in typescript too and set the environment to node. If you have wallaby I would recommend using it to run jest.

## Package.json and app.ts
We are on the home stretch now! Last thing is to setup some scripts in our `Package.json` and setup a basic `app.ts` and `app.spec.ts` to make sure our config is working.

*package.json*
```json
{
  // ...
  "type": "module",
  "scripts": {
    "test": "jest",
    "build": "rollup -c --environment NODE_ENV:production",
    "start": "rollup -c -w --environment NODE_ENV:development",
  },
  //...
}
```
Our output bundle is esm so in our package section we need to set `type: module`. We also setup some scripts to run tests, build our app for production, and watch our app for changes then rebuild/run them. Lets add two new files to our `src` folder.

*src/app.ts*
```typescript
export function app() {
  var res = '4';
  console.log(res);
  return res;
}
```

*src/app.spec.ts*
```typescript
import { app } from './app';

test('App works!', () => {
  expect(app()).toEqual('4');
});
```

These are some basic example files on where to get started in our project that should be replaced but this is a good way to test our configs.

---
## Trying it out
whew! That was a lot but we should now be able to test our configs! If you run `npm test` you should see jest start and our one test pass. `npm run build` should create an app.js file in our dist folder that we can take a look at. Finally `npm start` will build and run our app in watch mode. We should see `4` output to the console, and if we change our app function to return `5` our console should automatically update and output `5`!

## Closing thoughts
Understanding how we transform our source code into what we actually serve on the client can be complicated and have many steps but hopefully this broke down that process and showed that it's not too hard to understand if you get the basic ideas. Rollup is a pretty powerful bundler and is my goto when I want complete control over my build pipeline. Sometimes though I don't want to think about it and I still use `parcel` in many apps (including this website!) because of how easy it is to setup. So if bundling is still scary to you don't worry and just use `parcel` instead.

I would push this repo up to Github and you can mark it as a `Template` in the settings. This will allow you to create a new repo based on it easily so you don't have to copy/paste these configs. With this repo now you should be all setup to easily play with `koa`, `apollo`, or other web frameworks. I have also used mine to solve code challenges quickly by writing a test then solving it. You can also try adding `html` and `lit-element` to convert this to a front-end project pretty easily. Good luck! 🎉

---