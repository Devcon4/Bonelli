import { css, html, LitElement } from "lit";
import { customElement, property, query } from 'lit/decorators.js';
import { getLinkId } from '../services/linkUtils';
import { globalStyles } from "../styles/globalStyles";

@customElement('bn-subheading')
export default class SubheadingComponent extends LitElement {
  
  @property()
  text: string = '';

  currentPath: string = window.location.pathname;

  @query('a') aRef: HTMLAnchorElement;

  // linkId: lowercase of text with spaces replaced with dashes and non-alphanumeric characters removed
  get linkId() {
    return getLinkId(this.text);
  }

  get linkPath() {
    return `${this.currentPath}#${this.linkId}`;
  }

  clickLink() {
    setTimeout(() => {
      window.history.replaceState(null, '', this.linkPath);
      // Copy current url to clipboard
      navigator.clipboard.writeText(window.location.href);
      this.aRef.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
  }

  render() {
    return html`
      <div class="subheading">
        <h2 class="title">
          <div class="link-icon">#</div>
          <a href="${this.linkPath}" title="Copy Link" class="title-link" @click="${this.clickLink}">${this.text}</a>
        </h2>
      </div>
    `;
  }

  static get styles() {
    return [
      globalStyles,
      css`
        .subheading {
          font-size: 2rem;
          color: var(--light, var(--bnli4)) var(--dark, var(--bnli1));
          display: flex;
          filter: drop-shadow(0px 2px 3px rgb(0,0,0,.5));
        }

        .subheading:hover .link-icon {
          opacity: 1;
        }

        .title-link {
          text-decoration: none;
        }

        .title {
          display: flex;
          align-items: baseline;
          font-weight: 400;
          font-size: 2rem;
          background-color: var(--light, var(--bnli1)) var(--dark, var(--bnli4));
          margin: 0;
          padding: 24px 2em 24px var(--GutterWidth);

          clip-path: polygon(0 0, calc(100% - 2em) 0, 100% 50%, calc(100% - 2em) 100%, 0 100%);
        }

        .title * {
          font-weight: 400;
          font-size: 2rem;
        }

        .link-icon {
          color: var(--bnli-primary);
          text-decoration: underline;
          font-weight: 200;
          text-decoration-thickness: 2px;
          text-decoration-color: var(--bnli-secondary);
          opacity: 0;
          transition: all 120ms linear;

          margin-left: -1.5rem;
          padding-right: .5rem;
        }
      `
    ];
  }
}
