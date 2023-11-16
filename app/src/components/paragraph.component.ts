import { css, html, LitElement } from 'lit';
import { customElement, queryAll } from 'lit/decorators.js';
import { globalStyles } from '../styles/globalStyles';

@customElement('bn-paragraph')
export default class ParagraphComponent extends LitElement {

  // Get all a tags in the slot and add the current path to the href
  firstUpdated() {
    setTimeout(() => {

    let aTags = this.shadowRoot?.querySelectorAll('a');
    console.log(aTags);
    if(aTags) {
      aTags.forEach((aTag) => {
        let href = aTag.getAttribute('href');
        if(href) {
          aTag.setAttribute('href', window.location.pathname + href);
        }
      });
    }
    
  });
  }

  // firstUpdated() {
  //   console.log(this.aTags)
  //   if(this.aTags) {
  //     this.aTags.forEach((aTag) => {
  //       let href = aTag.getAttribute('href');
  //       if(href) {
  //         aTag.setAttribute('href', window.location.pathname + href);
  //       }
  //     });
  //   }
  // }

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
          padding: 0px;
        }

        .paragraph {
          display: inline-block;
        }
      `,
    ];
  }
}
