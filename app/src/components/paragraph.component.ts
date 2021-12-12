import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { globalStyles } from '../styles/globalStyles';

@customElement('bn-paragraph')
export default class ParagraphComponent extends LitElement {
  render() {
    return html`<div class="paragraph bn-flex"><slot></slot></div>`;
  }

  static get styles() {
    return [
      globalStyles,
      css`
        ::slotted(p) {
          font-size: 1.4rem;
          padding-left: var(--ParagraphOffset);
          padding-right: var(--ParagraphOffset);
          font-weight: 300;
          max-width: 1080px;
        }

        ::slotted(.bn-gutter) {
          margin-left: var(--GutterWidth);
          margin-right: var(--GutterWidth);
        }

        ::slotted(p) img {
          display: flex;
          justify-content: center;
        }

        ::slotted(.li-paragraph) {
          margin: 0;
        }

        .paragraph {
          display: inline-block;
        }
      `,
    ];
  }
}
