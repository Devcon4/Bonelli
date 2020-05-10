import { LitElement, css, html, property, customElement } from "lit-element";
import { globalStyles } from "../services/globalStyles";

@customElement('bn-banner')
export default class BannerComponent extends LitElement {
  
  @property()
  text: string;

  @property({ type: Boolean})
  hideReturn: boolean = true;
  
  render() {
    return html`
      <div class="banner">
        ${!this.hideReturn ? html`<router-link class="link" path="../"><div class="arrow"><</div></router-link>` : undefined}
        <h1 class="heading">${this.text}</h1>
      </div>`;
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
          text-decoration: underline solid var(--DarkShade);
  
        }

        .link {
          background-color: var(--LightAccent);
          padding: 4px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 12px;
          display: flex;
          align-items: center;
          justify-content: center;

          transition: all 250ms linear;
          outline: none;
        }

        .link:hover {
          filter: brightness(90%);
          cursor: pointer;
        }

        .arrow {
          color: var(--DarkShade);
          font-weight: bold;
          font-size: 56px;
          margin-top: -3px;
          margin-left: -3px;
          // background-color: var(--Main);
          // width: 32px;
          // height: 32px;
          // clip-path: polygon(68% 0, 24% 50%, 68% 100%, 44% 100%, 0% 50%, 44% 0);
        }

        @media (prefers-color-scheme: dark) {
          .heading {
            color: var(--bnd5);
            text-decoration-color: var(--bnd2);
          }

          .link {
            background-color: var(--bnd5);
          }

          .arrow {
            color: var(--bnd2);
          }
        }
      `
    ];
  }

}
