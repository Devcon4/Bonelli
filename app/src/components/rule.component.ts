import { css, html, LitElement } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { globalStyles } from "../styles/globalStyles";

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
          margin-bottom: var(--noPaint, 200px);
        }

        @media all and (max-width: 1000px) {
          .rule {
            margin-bottom: 0;
          }
        }

        .first-rule-override {
          margin-bottom: var(--noPaint, 200px);
        }

      `
    ];
  }
}
