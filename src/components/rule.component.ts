import { LitElement, css, html, customElement, property } from "lit-element";
import { globalStyles } from "../services/globalStyles";

@customElement('bn-rule')
export default class RuleComponent extends LitElement {
  
  @property({ type: Boolean})
  lockMargin: Boolean = false;

  render() {
    return html`<div class="rule ${this.lockMargin ? 'first-rule-override' : undefined}"></div>`;
  }
  
  static get styles() {
    return [
      globalStyles,
      css`
        .rule {
          margin-bottom: var(--hasPaint, 200px);
        }

        @media all and (max-width: 1000px) {
          .rule {
            margin-bottom: 0;
          }
        }

        .first-rule-override {
          margin-bottom: var(--hasPaint, 200px);
        }

      `
    ];
  }
}
