import { LitElement, css, html, customElement } from "lit-element";
import { globalStyles } from "../services/globalStyles";

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
