// import 'highlight.js/styles/dark.css';
import 'highlight.js/styles/dark.css';
import { css, html, LitElement } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { globalStyles } from "../styles/globalStyles";

@customElement('bn-codeblock')
export default class CodeblockComponent extends LitElement {
  
  @property()
  langName: string;

  render() {
    return html`<div class="codeblock bn-flex"><div class="lang">${this.langName}</div><slot></slot></div>`;
  }
  
  static get styles() {
    return [
      globalStyles,
      css`
        .codeblock {
          margin-left: var(--CodeblockOffset);
          margin-right: var(--CodeblockOffset);
          max-width: 1080px;
        }

        .lang {
          color: var(--bnli-secondary);
          margin-bottom: -12px;
        }
      `
    ];
  }
}
