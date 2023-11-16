import { css, html, LitElement } from "lit";
import { customElement, property, state } from 'lit/decorators.js';
import { globalStyles } from "../styles/globalStyles";

@customElement('bn-link')
export default class LinkComponent extends LitElement {
  
  @property()
  path: string;

  hashLink: boolean = false;

  firstUpdated() {
    if(this.path.startsWith('#')) {
      this.path = window.location.pathname + this.path;
      this.hashLink = true;
    }
  }

  clickLink() {
    if(!this.hashLink) return;

    window.history.replaceState(null, '', this.path);
    window.history.go();
  }

  render() {
    return html`<div class="link"><a href="${this.path}" @click="${this.clickLink}"><slot></slot></a></div>`;
  }
  
  static get styles() {
    return [
      globalStyles,
      css``
    ];
  }
}
