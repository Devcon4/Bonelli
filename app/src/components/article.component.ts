import { css, html, LitElement } from "lit";
import { customElement, query, queryAll, state } from 'lit/decorators.js';
import highlight from 'rehype-highlight';
import htmlStringify from 'rehype-stringify';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import { map } from "rxjs/operators";
import { unified } from 'unified';
import { u } from 'unist-builder';
import { async } from '../services/decoratorUtils';
import { getLinkId } from '../services/linkUtils';
import { all, list, listItem } from "../services/mdHandlerHelpers";
import themeState from '../services/themeState';
import { codeblockStyles } from "../styles/codeblockStyles";
import { fadeinAnimation, globalStyles } from "../styles/globalStyles";
import './banner.component';
import BannerComponent from "./banner.component";
import './codeblock.component';
import './inlinecode.component';
import './list.component';
import './paragraph.component';
import './rule.component';
import RuleComponent from "./rule.component";
import './subheading.component';
import {common, all as alltypes} from 'lowlight';
import './link.component';

export interface IArticle {
  data: () => Promise<typeof import("*.md")>;
}

export const pickFromLangs = <T extends keyof typeof alltypes>(...langs: T[]) => {
  let res: typeof alltypes = {};
  for(let lang of langs) {
    res[lang] = alltypes[lang];
  }
  return res;
}

@customElement('bn-article')
export default class ArticleComponent extends LitElement implements IArticle {
  data: () => Promise<typeof import("*.md")>;
  
  @query('article') articleRef: HTMLElement;
  @query('.article') articleClassRef: HTMLElement;
  @queryAll('bn-rule') rules: RuleComponent[];
  @queryAll('bn-banner') banners: BannerComponent[];

  @state()
  @async(themeState.theme.pipe(map(t => t === 'dark')))
  prefersDarkStyles: boolean;

  parser = unified()
    .use(markdown)
    .use(remark2rehype, {handlers: {
      'link': (h, node) => h(node, 'bn-link', {path: node.url}, all(h, node)),
      'paragraph': (h, node) => h(node, 'bn-paragraph', [h(node, 'p', {class: 'bn-gutter'}, all(h, node))]),
      'heading': (h, node) => h(node, node.depth === 1 ? 'bn-banner' : 'bn-subheading', {text: node.children[0].value, id: getLinkId(node.children[0].value)}),
      'list': (h, node) => h(node, 'bn-list', [list(h, node)]),
      'listItem': (h, node, parent) => listItem(h, node, parent),
      'break': (h, node) => h(node, 'bn-rule'),
      'thematicBreak': (h, node) => h(node, 'bn-rule'),
      'code': (h, node) => {
        let value = node.value + '\n';
        let lang = node.lang && node.lang.match(/^[^ \t]+(?=[ \t]|$)/);
        let props = {};

        if (lang) {
          (props as any).className = ['language-' + lang];
        }
        return h(node, 'bn-codeblock', {langName: node.lang}, [h(node.position, 'pre', [h(node, 'code', props, [u('text', value)])])])
      }
    }})
    .use(highlight, {languages: {...common, ...pickFromLangs('dockerfile', 'powershell', 'protobuf', 'pgsql', 'nginx', 'http', 'haskell', 'glsl', 'fsharp')}})
    .use(htmlStringify);
  // If the url has a hash, see if there is an element with that id and scroll to it.
  scrollIfHash() {
    if (window.location.hash) {
      let element = this.shadowRoot.getElementById(window.location.hash.substring(1));
      if (element) {
        element.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    }
  }

  async firstUpdated() {
    this.articleRef.innerHTML = await this.generate(await this.data());

    setTimeout(() => {
      // The first rule will always have margin.
      let [firstRule] = this.rules;
      firstRule.lockMargin = true;

      let [firstBanner] = this.banners;
      firstBanner.showReturn = true;
      firstBanner.showToggle = true;

      this.scrollIfHash();
    })

    // Watch for resizes and set the lineswaps so the lines cross at the right points.
    let obs = new ResizeObserver(() => {
      let lineSwaps = [];

      for(let rule of this.rules) {
        let offset = 12;
        // let offset = lineSwaps.length <= 0 ? 150 : 138; // The first rule has a margin-top of 12px.
        lineSwaps.push(rule.offsetTop + offset);
      }

      if (lineSwaps.length % 2) {
        lineSwaps.push('110%');
      }

      this.articleClassRef.style.setProperty('--line-swaps', `\"${lineSwaps.join(', ')}\"`);
    })

    obs.observe(this.articleClassRef,)
  }

  async generate(mdString: typeof import("*.md")) {
    const res = await this.parser.process(mdString.default as unknown as string);
    return String(res);
  }

  //Listen for history changes and scroll to the element with the id of the hash.
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('navigationend', () => {
      this.scrollIfHash();
    });
  }

  render() {
    return html`<div class="article bn-flex ${this.prefersDarkStyles}"><article></article></div>`;
  }
  
  static get styles() {
    return [
      globalStyles,
      codeblockStyles,
      fadeinAnimation,
      css`

      article {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      .article {
        --line-swaps: '150, 80000';
        --line-background: var(--bnli-background);
        --line-color-left: var(--light, var(--bnli11)) var(--dark, var(--bnli7));
        --line-color-center: var(--light, var(--bnli13)) var(--dark, var(--bnli9));
        --line-color-right: var(--light, var(--bnli1)) var(--dark, var(--bnli4));
        background-image: paint(linePattern);

        scroll-behavior: smooth;

        padding-bottom: 25vh;
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
        font-size: 1.2rem;
        color: var(--bnli-secondary);
        background-color: var(--bnli-surface);
        font-weight: bold;
        padding: 2px;
        border-radius: 6px;
        filter: drop-shadow(0px 3px 2px rgba(0,0,0, 0.2));
      }

      a {
        color: var(--bnli-primary);
      }

      .dark-theme code {
        color: var(--bnd3);
      }

      
      `
    ];
  }
}

