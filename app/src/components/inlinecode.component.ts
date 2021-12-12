import { css, html, LitElement } from "lit";
import { customElement } from 'lit/decorators.js';
import { globalStyles } from "../styles/globalStyles";

@customElement('bn-inlinecode')
export default class InlinecodeComponent extends LitElement {
  
  render() {
    return html`<div class="inlinecode"><slot></slot></div>`;
  }
  
  static get styles() {
    return [
      globalStyles,
      css``
    ];
  }
}
