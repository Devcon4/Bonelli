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
