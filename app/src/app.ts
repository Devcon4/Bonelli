import '@material/mwc-icon-button';
// @ts-ignore iife-str: is valid!
import line from 'iife-str:./workers/line.js';
import { css, html, LitElement } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { IRoute, RouterSlot } from 'router-slot';
import 'router-slot/router-slot';
import { async } from './services/decoratorUtils';
import routeState from './services/routeState';
import themeState, { ThemeType } from './services/themeState';
import { flexHostStyles, globalStyles } from './styles/globalStyles';

const lineBlob = new Blob([line], { type: 'text/javascript' });
const lineUrl = URL.createObjectURL(lineBlob);
// @ts-ignore This does too exist!
CSS.paintWorklet.addModule(lineUrl);

@customElement('bnli-app')
export default class AppElement extends LitElement {
  @state()
  @async(themeState.theme)
  colorTheme: ThemeType;

  @state()
  @async(routeState.routes)
  routes: IRoute[];

  @query('router-slot')
  $routerSlot!: RouterSlot;

  toggleThemeAction = () => themeState.toggleTheme();

  firstUpdated() {
    this.$routerSlot.add(this.routes);

    document.body.style.setProperty(
      '--GutterWidth',
      50 + 64 * 2 + 12 * 3 + 'px'
    ); // These numbers correlate to how many and how thick the lines drawn are.
  }

  render() {
    return html`<div class="app flex">
      <!-- <div class="header">
        <h1>🐦 App Works!</h1>
        <mwc-icon-button
          id="theme-btn"
          @click=${this.toggleThemeAction}
          .icon="${this.colorTheme === 'dark' ? 'light_mode' : 'nights_stay'}"
        ></mwc-icon-button>
      </div>
      <div class="box-list">
        <div class="box box-1">primary</div>
        <div class="box box-2">primary variant</div>
        <div class="box box-3">secondary</div>
        <div class="box box-4">secondary variant</div>
        <div class="box box-5">background</div>
        <div class="box box-6">surface</div>
        <div class="box box-7">error</div>
      </div> -->
      <router-slot class="flex"></router-slot>
    </div>`;
  }

  static get styles() {
    return [
      globalStyles,
      flexHostStyles,
      css`
        .app {
          display: flex;
        }

        .header {
          display: flex;
          justify-content: space-between;
          padding: 12px;
        }

        .box-list {
          max-width: 1024px;
          align-self: center;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
        }

        .box {
          width: calc(100% / 4 - 48px);
          aspect-ratio: 1;
          border-radius: 5px;
          padding: 12px;
          margin: 12px;
          filter: drop-shadow(0 3px 3px rgba(0, 0, 0, 0.2));
        }

        @media (max-width: 512px) {
          .box {
            width: 100%;
          }
        }

        .box-1 {
          background-color: var(--bnli-primary);
          color: var(--bnli-on-primary);
        }
        .box-2 {
          background-color: var(--bnli-primary-variant);
          color: var(--bnli-on-primary);
        }
        .box-3 {
          background-color: var(--bnli-secondary);
          color: var(--bnli-on-secondary);
        }
        .box-4 {
          background-color: var(--bnli-secondary-variant);
          color: var(--bnli-on-secondary);
        }
        .box-5 {
          background-color: var(--bnli-background);
          color: var(--bnli-on-background);
        }
        .box-6 {
          background-color: var(--bnli-surface);
          color: var(--bnli-on-surface);
        }
        .box-7 {
          background-color: var(--bnli-error);
          color: var(--bnli-on-error);
        }
      `,
    ];
  }
}
