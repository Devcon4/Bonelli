import { css, html, LitElement } from "lit";
import { customElement } from 'lit/decorators.js';
import { globalStyles } from "../styles/globalStyles";

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

        ::slotted(ul) {
          list-style-position:inside;
        }
  
        p {
          margin: 0;
        }

      `
    ];
  }
}
