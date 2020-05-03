import { LitElement, css, html, customElement, query, queryAll } from "lit-element";
import { globalStyles, codeblockStyles } from "../services/globalStyles";
import unified from 'unified';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import mdjsParse from '@mdjs/core';
import highlight from 'rehype-highlight';
import htmlStringify from 'rehype-stringify';
import { all, wrap, list, listItem } from "../services/mdHandlerHelpers";
import u from 'unist-builder';

import './banner.component';
import './subheading.component';
import './paragraph.component';
import './codeblock.component';
import './list.component';
import './inlinecode.component';
import './rule.component';
import BannerComponent from "./banner.component";

@customElement('bn-article')
export default class ArticleComponent extends LitElement {
  
  @query('article') articleRef: HTMLElement;
  @query('.article') articleClassRef: HTMLElement;
  @queryAll('bn-rule') rules: BannerComponent[];

  parser = unified()
    .use(markdown)
    .use(mdjsParse as any)
    .use(remark2rehype, {handlers: {
      'paragraph': (h, node) => h(node, 'bn-paragraph', [h(node, 'p', {class: 'bn-gutter'}, all(h, node))]),
      'heading': (h, node) => h(node, node.depth === 1 ? 'bn-banner' : 'bn-subheading', {text: node.children[0].value}),
      'list': (h, node) => h(node, 'bn-list', [list(h, node)]),
      'listItem': (h, node, parent) => listItem(h, node, parent),
      'break': (h, node) => h(node, 'bn-rule'),
      'thematicBreak': (h, node) => h(node, 'bn-rule'),
      'code': (h, node) => {
        var value = node.value + '\n';
        var lang = node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/);
        var props = {};

        if (lang) {
          (props as any).className = ['language-' + lang];
        }
        return h(node, 'bn-codeblock', {langName: node.lang}, [h(node.position, 'pre', [h(node, 'code', props, [u('text', value)])])])
      }
    }})
    .use(highlight)
    .use(htmlStringify);

  updated() {
      
  }

  async firstUpdated() {
    //@ts-ignore I know what I'm doing!
    this.articleRef.innerHTML = await this.generate(this.data);

    // The first rule will always have margin.
    setTimeout(() => {
      let [first] = this.rules;
      first.shadowRoot.querySelector('.rule').classList.add('first-rule-override');
    })

    // Watch for resizes and set the lineswaps so the lines cross at the right points.
    // @ts-ignore It does too exist!
    let obs = new ResizeObserver(() => {
      var lineSwaps = [];

      for(let banner of this.rules) {
        let offset = 12;
        // let offset = lineSwaps.length <= 0 ? 150 : 138; // The first banner has a margin-top of 12px.
        lineSwaps.push(banner.offsetTop + offset);
      }

      if (lineSwaps.length % 2) {
        lineSwaps.push('110%');
      }

      this.articleClassRef.style.setProperty('--line-swaps', `\"${lineSwaps.join(', ')}\"`);
    })

    obs.observe(this.articleClassRef,)
  }

  async generate(mdString: string) {
    const res = await this.parser.process(mdString);
    return res.contents;
  }

  render() {
    return html`<div class="article bn-flex"><article></article></div>`;
  }
  
  static get styles() {
    return [
      globalStyles,
      codeblockStyles,
      css`

      .article {
        --line-swaps: '150, 80000';

        background-image: paint(linePattern);
      }

      @media all and (max-width: 1000px) {
        * {
          --GutterWidth: 12px;
          --CodeblockOffset: 12px;
          --ParagraphOffset: 12px;
        }
        .article {
          --line-offscreen: true;

        }
      }

      code {
        font-size: 20px;
        color: var(--DarkAccent);
        background-color: var(--LightAccent);
        font-weight: bold;
        padding: 2px;
        border-radius: 6px;
        filter: drop-shadow(0px 3px 2px rgba(0,0,0, 0.2));
      }

      a {
        color: var(--DarkAccent);
      }

      .debug {
        --LightShade: rgb(47, 49, 58);
        --LightAccent: rgb(57, 67, 77);
        --Main: rgb(171, 124, 127);
        --DarkAccent: rgb(63,127,138);
        --DarkShade: rgb(196, 181, 163);
      }

      @media (prefers-color-scheme: dark) {
        code {
          color: var(--bnd3);
        }
      }

      `
    ];
  }
}

