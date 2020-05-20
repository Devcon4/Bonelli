import { LitElement, css, html, property, customElement, internalProperty } from "lit-element";
import { globalStyles, materialIconStyles } from "../services/globalStyles";
import getThemeManager from "../services/theme";
import { map } from "rxjs/operators";

const themeManager = getThemeManager();

@customElement('bn-banner')
export default class BannerComponent extends LitElement {
  
  @property()
  text: string;

  @property({ type: Boolean})
  showReturn: boolean = false;
  
  @property({ type: Boolean})
  showToggle: boolean = false;
  
  @internalProperty()
  prefersDarkStyles: 'dark-theme' | '' = '';

  firstUpdated() {
    themeManager.currentThemeObs.pipe(map(theme => theme === 'dark' ? 'dark-theme' : '')).subscribe(val => this.prefersDarkStyles = val);
  }
  
  toggleButton() {
    let styles = css`
      .icon {
        color: var(--bnl2);
        transition: all 250ms linear;
      }

      .icon:hover {
        cursor: pointer;
        background: rgba(0,0,0,.2);
        filter: drop-shadow(0 2px 4px rgba(0,0,0,.2))
      }
    `;
    let darkStyles = css`
      .icon {
        color: var(--bnd5);
        transition: all 250ms linear;
      }

      .icon:hover {
        cursor: pointer;
        background: rgba(0,0,0,.2);
        filter: drop-shadow(0 2px 4px rgba(0,0,0,.2))
      }
    `;
    let label = this.prefersDarkStyles == 'dark-theme' ? 'Toggle light theme' : 'Toggle dark theme';

    return html`<bn-icon
      title="${label}"
      aria-label="${label}"
      type=${this.prefersDarkStyles == 'dark-theme' ? 'flare' : 'nights_stay'}
      styleOverrides=${this.prefersDarkStyles == 'dark-theme' ? darkStyles : styles}></bn-icon>`;
  }

  render() {
    return html`
      <div class="banner ${this.prefersDarkStyles}">
        ${this.showReturn ? html`<a class="link" href="."><div class="arrow"><</div></a>` : undefined}
        <h1 class="heading">${this.text}</h1>
        ${this.showToggle ? html`<button @click=${() => themeManager.toggleTheme()}>${this.toggleButton()}</button>` : undefined}
      </div>`;
  }

  static get styles() {
    return [
      globalStyles,
      css`

        a {
          text-decoration: none;
        }

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

        a {
          text-decoration: none;
        }

        button {
          background: none;
          border: none;
          outline: none;
        }

        .dark-theme .heading {
          color: var(--bnd5);
          text-decoration-color: var(--bnd2);
        }

        .dark-theme .link {
          background-color: var(--bnd5);
        }

        .dark-theme .arrow {
          color: var(--bnd2);
        }
      `
    ];
  }

}
