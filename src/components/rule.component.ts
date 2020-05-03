import { LitElement, css, html, customElement } from "lit-element";
import { globalStyles } from "../services/globalStyles";

@customElement('bn-rule')
export default class RuleComponent extends LitElement {
  
  render() {
    return html`<div class="rule"></div>`;
  }
  
  static get styles() {
    return [
      globalStyles,
      css`
        .rule {
          margin-bottom: 200px;
        }

        @media all and (max-width: 1000px) {
          .rule {
            margin-bottom: 0;
          }
        }

        .first-rule-override {
          margin-bottom: 200px;
        }

      `
    ];
  }
}
