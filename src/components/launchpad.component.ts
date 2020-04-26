import { LitElement, customElement, html, css } from "lit-element";
import { globalStyles, flexHostStyles } from "../services/globalStyles";
import { posts } from "../main";
import { RouterLink } from 'router-slot';

@customElement('bn-launchpad')
export default class LaunchpadComponent extends LitElement {
  
  render() {
    return html`<div class="launchpad bn-flex">
      ${Object.entries(posts).map(([path, val]) => this.card(val))}
    </div>`;
  }

  card(post) {
    return html`<router-link path=${post.path}>
      <button>${post.name}</button>
    </router-link>`
  }
  
  static get styles() {
    return [
      globalStyles,
      flexHostStyles,
      css`
      `];
  }
}
