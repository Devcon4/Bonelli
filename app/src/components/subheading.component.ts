import { css, html, LitElement } from "lit";
import { customElement, property } from 'lit/decorators.js';
import { globalStyles } from "../styles/globalStyles";

@customElement('bn-subheading')
export default class SubheadingComponent extends LitElement {
  
  @property()
  text: string;

  render() {
    return html`
      <div class="subheading">
        <h2 class="title">${this.text}</h2>
      </div>
    `;
  }

  static get styles() {
    return [
      globalStyles,
      css`
        .subheading {
          font-size: 2rem;
          color: var(--light, var(--bnli4)) var(--dark, var(--bnli1));
          display: flex;
          filter: drop-shadow(0px 2px 3px rgb(0,0,0,.5));
        }
        .title {
          display: block;
          font-weight: 400;
          font-size: 2rem;
          background-color: var(--light, var(--bnli1)) var(--dark, var(--bnli4));
          margin: 0;
          padding: 24px 2em 24px var(--GutterWidth);

          clip-path: polygon(0 0, calc(100% - 2em) 0, 100% 50%, calc(100% - 2em) 100%, 0 100%);
        }
      `
    ];
  }
}
