import { LitElement, css, html, customElement, query } from "lit-element";
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

@customElement('bn-article')
export default class ArticleComponent extends LitElement {
  
  @query('article') articleRef: HTMLElement;

  parser = unified()
    .use(markdown)
    .use(mdjsParse as any)
    .use(remark2rehype, {handlers: {
      'paragraph': (h, node) => h(node, 'bn-paragraph', [h(node, 'p', {class: 'bn-gutter'}, all(h, node))]),
      'heading': (h, node) => h(node, node.depth === 1 ? 'bn-banner' : 'bn-subheading', {text: node.children[0].value}),
      'list': (h, node) => h(node, 'bn-list', [list(h, node)]),
      'listItem': (h, node, parent) => listItem(h, node, parent),
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

  async firstUpdated() {
    this.articleRef.innerHTML = await this.generate(this.data);

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
        --line-count: 6;
        --line-colors: '';
        --line-swaps: '150, 80000';

        --animation-tick: 0;
        background-image: paint(linePattern);
      }

      @media all and (max-width: 1000px) {
        * {
          --GutterWidth: 12px;
          --CodeblockOffset: 12px;
        }
        .article {
          --line-offscreen: true;

        }
      }

      code {
        font-size: 20px;
        color: var(--DarkAccent);
        background-color: var(--LightAccent);
        padding: 2px;
        border-radius: 6px;
        filter: drop-shadow(0px 3px 2px rgba(0,0,0, 0.2));
      }

      a {
        color: var(--DarkAccent);
      }
      `
    ];
  }
}

