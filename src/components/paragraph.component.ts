import { LitElement, css, html, customElement, property, query } from "lit-element";
import { globalStyles } from "../services/globalStyles";

@customElement('bn-paragraph')
export default class ParagraphComponent extends LitElement {

  render() {
    return html`<div class="paragraph ng-flex"><slot></slot></div>`;
  }

  static get styles() {
    return [
      globalStyles,
      css`
      ::slotted(p) {
        font-size: 24px;
        padding-left: var(--ParagraphOffset);
        padding-rigth: var(--ParagraphOffset);
        font-weight: 300;
      }

      ::slotted(.bn-gutter) {
        margin-left: var(--GutterWidth);
        margin-right: var(--GutterWidth);
      }

      ::slotted(.li-paragraph) {
        margin: 0;
      }

      .paragraph {
        display: inline-block;

      }

      `
    ];
  }
}
