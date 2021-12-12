import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { globalStyles } from '../styles/globalStyles';

@customElement('bn-icon')
export default class IconComponent extends LitElement {
  @property()
  type: string;

  @property()
  styleOverrides = css``;

  typeMap = {
    nights_stay: this.night,
    flare: this.day,
  };


  render() {
    return html`<style>${this.styleOverrides}</style><div class="icon">${this.typeMap[this.type]()}</div>`;
  }
  
  static get styles() {
    return [
      globalStyles,
      css`
        .icon>svg {
          width: 38px;
          height: 38px;
        }

        .icon {
          border-radius: 50%;
          padding: 4px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `
    ];
  }

  night() {
    return html` <svg
      xmlns="http://www.w3.org/2000/svg"
      enable-background="new 0 0 24 24"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="18px"
      height="18px"
    >
      <g><rect fill="none" height="24" width="24" /></g>
      <g>
        <g>
          <g>
            <path
              d="M11.1,12.08C8.77,7.57,10.6,3.6,11.63,2.01C6.27,2.2,1.98,6.59,1.98,12c0,0.14,0.02,0.28,0.02,0.42 C2.62,12.15,3.29,12,4,12c1.66,0,3.18,0.83,4.1,2.15C9.77,14.63,11,16.17,11,18c0,1.52-0.87,2.83-2.12,3.51 c0.98,0.32,2.03,0.5,3.11,0.5c3.5,0,6.58-1.8,8.37-4.52C18,17.72,13.38,16.52,11.1,12.08z"
            />
          </g>
          <path
            d="M7,16l-0.18,0C6.4,14.84,5.3,14,4,14c-1.66,0-3,1.34-3,3s1.34,3,3,3c0.62,0,2.49,0,3,0c1.1,0,2-0.9,2-2 C9,16.9,8.1,16,7,16z"
          />
        </g>
      </g>
    </svg>`;
  }

  day() {
    return html` <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="18px"
      height="18px"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path
        d="M7 11H1v2h6v-2zm2.17-3.24L7.05 5.64 5.64 7.05l2.12 2.12 1.41-1.41zM13 1h-2v6h2V1zm5.36 6.05l-1.41-1.41-2.12 2.12 1.41 1.41 2.12-2.12zM17 11v2h6v-2h-6zm-5-2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm2.83 7.24l2.12 2.12 1.41-1.41-2.12-2.12-1.41 1.41zm-9.19.71l1.41 1.41 2.12-2.12-1.41-1.41-2.12 2.12zM11 23h2v-6h-2v6z"
      />
    </svg>`;
  }
}
