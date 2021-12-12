import '@material/mwc-icon';
import { css, html, LitElement } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import { map } from "rxjs/operators";
import { async } from '../services/decoratorUtils';
import themeState from '../services/themeState';
import { globalStyles } from "../styles/globalStyles";

@customElement('bn-banner')
export default class BannerComponent extends LitElement {
  
  @property()
  text: string;

  @property({ type: Boolean})
  showReturn: boolean = false;
  
  @property({ type: Boolean})
  showToggle: boolean = false;
  
  @state()
  @async(themeState.theme.pipe(map(t => t === 'dark')))
  prefersDarkStyles: boolean;

  toggleThemeAction = () => themeState.toggleTheme();

  render() {
    return html`
      <div class="banner">
        ${this.showReturn ? html`<a class="link" href="./launchpad"><mwc-icon class="arrow">arrow_back</mwc-icon></a>` : undefined}
        <h1 class="heading">${this.text}</h1>
        <mwc-icon-button
          id="theme-btn"
          @click=${this.toggleThemeAction}
          .icon="${this.prefersDarkStyles ? 'light_mode' : 'nights_stay'}"
        ></mwc-icon-button>
      </div>`;
  }

  static get styles() {
    return [
      globalStyles,
      css`
        #theme-btn {
          margin-right: 12px;
          color: var(--bnli4);
        }

        a {
          text-decoration: none;
        }

        .banner {
          display: flex;
          align-items: center;
          margin: 20px 0;
          z-index: 1000;
          background-color: var(--bnli-primary);
          filter: drop-shadow(0px 4px 4px rgb(0,0,0,.6));
          padding-top: 12px;
          padding-bottom: 12px;
          padding-left: var(--GutterWidth);
          background: var(--bnli-primary);
        }

        .heading {
          margin: 0;
          flex: 1;
          font-family: voltage,sans-serif;
          font-style: normal;
          font-weight: 400;
          font-size: 3rem;
          color: var(--bnli4);
          text-decoration: underline solid var(--bnli2);
  
        }

        .link {
          background-color: var(--bnli4);
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
          color: var(--bnli3);
          font-weight: 600;
        }

        a {
          text-decoration: none;
        }

        button {
          background: none;
          border: none;
          outline: none;
        }
/* 
        .dark-theme .heading {
          color: var(--bnd5);
          text-decoration-color: var(--bnd2);
        }

        .dark-theme .link {
          background-color: var(--bnd5);
        }

        .dark-theme .arrow {
          color: var(--bnd2);
        } */
      `
    ];
  }

}
