import { LitElement, css, html, customElement, property } from "lit-element";
import { globalStyles } from "../services/globalStyles";
import 'highlight.js/styles/dark.css';

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
        }

        .lang {
          color: var(--Main);
          margin-bottom: -12px;
        }
      `
    ];
  }
}
