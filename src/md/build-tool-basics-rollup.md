# Build tool basics: Rollup
---
## Primer
Bundling is an important part of any modern website, but it can be quite hard to wrap your head around what exactly happens to your source code when you make a production build. Lets take a look at build tools and bundling in general then setup a simple Rollup config to setup bundling a Typescript project.

## How did we get here?
In the distant past websites use to just be a collection of html with maybe a few scripts with nothing really special going on. As people started adding more and more Javascript and the idea of SPA apps on the rise everyone started to pay more attention to what exactly they sent to the client. People started to care about compressing their Javascript to be as small as possible, stripping out whitespace, using modules, and many other techniques became popular. Transpiling with languages like Typescript and SCSS hit the mainstream along with using Babel to Polyfill new Javascript features into older browsers. Nowadays your source code will almost definitely look way different from your production code. This lead to the need for tools to do all of this work for us and create an optimized bundle to send to users.

## What exactly is a bundler?
In the most basic sense a bundler takes your Javascript, figures out all of the dependencies, then applies transformations to them. Bundlers can do a lot more but at their core this is what all bundlers do. The main bundlers used nowadays are `Webpack`, `Parcel`, or `Rollup`. There are also Framework CLI tools like `@angular/cli`, `create-react-app`, or `@vue/cli` which hide the bundler so you don't have to worry about it. Some others that are worth mentioning are `Snowpack` and `Vite`. Figuring out dependencies and linking them is actually is a complex topic with a storied history in Javascript though.

## Javascript Modules
Here is a quick summary of the different module systems for Javascript that have existed over the years. I won't go into much detail but feel free to look them up.

IIFE (Immediately-Invoked Function Expression): This is one of the first module patterns. The still have their place if you are making say a NodeJS app that runs as soon as you call it but people stopped using it as a module system because they would just globally declare variables.

CommonJS: The next main module system came out with the advent of NodeJS. This is where node_modules started as. The `module.exports` or `require("someModule")` syntax began here. CommonJS always had problems running in browsers though.

AMD (Asynchronous Module Definition): This one was short lived. It was created by RequireJS to bring modules to the front-end. This one uses `define("moduleName", ["dep1", "dep2"], function(){/* do stuff */})` syntax.

UMD (Universal Module Definition): This combines CommonJS and AMD into one system that can work on both nodeJS and Browsers. If you use Webpack or are building to a browser you will probably see this system used.

ESM: This is the new shinny ESModule system that has been officially adopted by Javascript. You should try to use this system wherever possible, although UMD is still kinda common to see as people transition. This introduced the `import { foo } from 'bar';` syntax.