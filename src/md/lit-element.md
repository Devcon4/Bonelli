# About this Blog
---

## Introduction

The purpose of this website is to have a central place to publish any blog posts or training I write. It originally started as a coding challenge to create a dead simple blog in two week but I have expanded it to allow for multiple posts and to generate from markdown.

## The Stack

This website is powered by the awesomeness that is Lit-Element. It's small and relatively unknown but is make by the Polymer team at Google. Basically it is a Web Component wrapper built around Lit-Html, also created by the Polymer team. 

Modern frameworks have to deal with the problem of change detection. Some solve this using VirtualDOM, where instead of directly changing the DOM you change a Javascript representation of the DOM. Then you find the difference between your fake DOM and the real DOM, then only change the parts of the real DOM that are different.

Lit-Html doesn't have that, instead it uses a fancy Javascript feature called Tagged Template Literals! 🙌 Besides `'` and `"` Javascript has a third string syntax using ticks (\`). With these strings you can embed content like `My name is ${this.name}`. pretty cool huh, but even cooler is that you can "tag" this string literal with a Javascript function. That is exactly what Lit-Html does to track changes to the DOM. By watching every set of ${} it knows when the expression changes to update the DOM around it, without diffing and other stuff.

Lit-Element builds on top of this idea by adding some fancy decorators to easily create Web Components powered by Lit-Html rendering. Here is an example component called "dev-paragraph" that has an input attribute called "content".

``` typescript
import { LitElement, customElement, property, html, css } from 'lit-element';

@customElement('dev-paragraph')
export default class ParagraphComponent extends LitElement {
    @property() content: string;

    render() {
        return html`<p>${this.content}</p>`;
    }
}
```

🎉 What a perfect small component! 🎉

Of course no app is complete until you have Typescript. It's Javascript but better! It's flexible yet helps you know what a function is suppose to do/return. I always use it when I can.

To bundle and compile my Typescript/Lit-Element I used the awesome zero-config bundler Parcel. Basically it's smart and opinionated Webpack that tries to take your code and figure out how you want to build it, perfect for small stuff where you don't care about the nitty gritty of configuring Webpack.

## Styling

No pig is complete without some lipstick and this one has plenty. It has shadows, colors and even fonts! 🙌 I like to use CSS variables wherever I can, all of the colors are hooked to five theme colors (LightShade, LightAccent, Main, DarkAccent, DarkShade). Besides being clean this lets me dynamically change the theming of the site! This lets me use the `prefers-color-scheme` media query to set a dark mode version of the site. This is normally a pain, most of the time you would using a CSS post-processor like SASS where you can't dynamically change variables. Even if you aren't you would have to dynamically change colors with some unintuitive Javascript.

Lit-Element has a pretty slick way of adding CSS to components, and because ShadowDOM already has scoped styles there is no need for CSS modules which can be kind of bulky to use. Here is an example of the bn-list component with styles.

``` typescript
import { LitElement, css, html, customElement } from "lit-element";
import { globalStyles } from "../services/globalStyles";

@customElement('bn-list')
export default class ListComponent extends LitElement {
  
  render() {
    return html`<div class="list"><slot></slot></div>`;
  }
  
  static get styles() {
    return [
      globalStyles,
      css`
        .list {
          margin-left: var(--GutterWidth);
          margin-right: var(--GutterWidth);
        }

        p {
          margin: 0;
        }
      `
    ];
  }
}

```

We can add CSS using a Tagged Template Literal just like HTML! The Styles getter returns a list so we can add multiple CSS blocks together. This is great for global styles or for reusing CSS animations.

## Magic
The last piece of the pie is that background, just look at those sexy lines! There is some special sauce used to make that background, if you look you may have seen this line.

``` css
.background {
    --line-swaps: '150,1850';
    background-image: paint(linePattern);
}
```

There is a whole new suite of API's coming out under the name Houdini (ishoudinireadyyet.com). The goal of these API's is to let you hook into the browsers lifecycle. The main one I am using is the CSS Paint API. It is the perfect blend of drawing on a canvas but still using DOM elements. I will probably go more in-depth into this in the future but basically I am telling the browser how I want it to draw the background div, pretty cool huh.

## Content
---

I recently expanded this website to allow creating multiple blog posts. I wanted to still have my pretty website but to write posts in Markdown. To do this I use a bunch of tools from the Unified eco-system. Unified is the base library that Gatsby and other tools use to transform markdown and other languages. It's pretty powerful and lets you chain transformations. For example I have a pipeline that takes Markdown and transforms that to html while replacing certain md blocks (paragraphs, headings, etc) with my own components. I then run that code through Highlight.js to get pretty formatted code blocks. 

By wrapping markdown blocks in my own components I get better control over how they will look and function. It also allows me in the future to add custom blocks so if I want to add code editors or image carousels I can!

## Hosting

I host my sight on DigitalOcean, it's simple and works perfectly for everything I need. I have been trying to move all my sites over to use Kubernetes. This one is easy sense it's just an NGINX serving my static files. There is a Traefik ingress controller that manages routing and lets-encrypt which was super easy to setup. I'm super happy with how it turned out even though it's overkill for this simple website.

## Pain Points

Even though I think this stack is awesome I did have some hiccups I ran into. The biggest being ShadowDOM and how Slots work in Web Components. Slots are how you can insert child elements to Web Components. We can take our component above and change it so we don't have to add a content attribute.

``` typescript
import { LitElement, customElement, html } from 'lit-element';

@customElement('dev-paragraph')
export default class ParagraphComponent extends LitElement {
    render() {
        return html`<p><slot></slot></p>`;
    }
}
```

We could now use this element by adding children elements. This is sometimes referred to as Light DOM or you might have heard of the term transclusion.

``` html
<article>
    <h1>My awesome article!</h1>
    <dev-paragraph>This is some light DOM!</dev-paragraph>
</article>
```

This lets us write wrappers in a natural way. The tricky part is how this relationship is shown when you inspect in Devtools is unintuitive. Your Light DOM appears next to your Shadow Root not nested how it is actually structured.

Another issue was with remark2rehype which is the library that converts markdown to html and replaces code blocks with my custom components. They use a bunch of helper functions internally but don't export them. I ended up having to copy their code for these functions so I could plug in my components correctly.

I also have not been able to get CSS Paint API to polyfill correctly to Firefox. Even if I add the polyfill I think because of the ShadowDOM it is not replacing properly for Firefox. This means you won't currently see my pretty lines. 🙁

## Conclusion
That was a high level overview of this website and Lit-Elements! Overall I love this stack for small projects, It's simple and is very similar to what people want vanilla Web Components to be.
