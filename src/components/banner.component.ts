import { LitElement, css, html, property, customElement } from "lit-element";
import { globalStyles } from "../services/globalStyles";

@customElement('bn-banner')
export default class BannerComponent extends LitElement {
  
  @property()
  text: string;
  
  render() {
    return html`<div class="banner"><h1 class="heading">${this.text}</h1></div>`;
  }

  static get styles() {
    return [
      globalStyles,
      css`
        .banner {
          display: flex;
          align-items: center;
          margin: 20px 0;
          z-index: 1000;
          background-color: var(--DarkAccent);
          filter: drop-shadow(0px 4px 4px rgb(0,0,0,.6));
          padding-top: 12px;
          padding-bottom: 12px;
          padding-left: var(--GutterWidth);
          padding-right: var(--GutterWidth);
          background: var(--DarkAccent);
        }
  
        .heading {
          margin: 0;
          flex: 1;
          font-family: voltage,sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 42px;
          color: var(--LightShade);
          text-decoration: underline solid var(--Main);
  
        }

        @media (prefers-color-scheme: dark) {
          .heading {
            color: var(--bnd6);
          }
        }
      `
    ];
  }

}
