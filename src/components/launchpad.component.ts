import { LitElement, customElement, html, css } from "lit-element";

@customElement('bn-launchpad')
export default class LaunchpadComponent extends LitElement {
  static styles = css`
    .launchpad {
      --line-count: 6;
      --line-colors: '';
      --line-swaps: '150, 8000';
      --animation-tick: 0;
      --LightShade: var(--bn0);
      --LightAccent: var(--bn1);
      --Main: var(--bn2);
      --DarkAccent: var(--bn3);
      --DarkShade: var(--bn4);
      background-image: paint(linePattern);
    }
  `;

  render() {
    return html`<div class="launchpad">
      <h1>It works!</h1>
    </div>`;
  }
}