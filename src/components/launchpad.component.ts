import { LitElement, customElement, html, css } from "lit-element";
import { globalStyles, flexHostStyles, fadeinAnimation } from "../services/globalStyles";
import { PostType } from "../main";
import { posts } from "../services/posts";
import { RouterLink } from 'router-slot';
import './rule.component';

@customElement('bn-launchpad')
export default class LaunchpadComponent extends LitElement {
  
  render() {
    return html`
    <div class="launchpad bn-flex">
      <bn-banner text="Cyphers.dev" hideReturn></bn-banner>
      <bn-rule lockMargin></bn-rule>
      <bn-subheading text="Latest Posts"></bn-subheading>
      ${Object.entries(posts)
        .sort((a, b) => a[1].publishDate > b[1].publishDate ? -1 : 1)
        .map(([path, val]) => this.card(val))
      }
    </div>`;
  }

  card(post: PostType) {
    let formatDate = post.publishDate.toDateString();

    return html`
      <div class="wrapper">
        <div class="card">
          <div class="title">
            <a href=${post.path}><h3>${post.name}</h3></a>
            <div class="card-date">${formatDate}</div>
          </div>
          <div>${post.description}</div>
        </div>
      </div>
    `
  }
  
  static get styles() {
    return [
      globalStyles,
      flexHostStyles,
      fadeinAnimation,
      css`

      .launchpad {
        --line-swaps: '150, 80000';
        background-image: paint(linePattern);
        min-height: 100vh;
        transition: all 250ms linear;
      }

      .launchpad>*:not(bn-banner):not(bn-subheading) {
        padding: 0 var(--GutterWidth);
      }

      h3 {
        margin: 0;
      }

      .title {
        display: flex;
        justify-content: space-between;
      }

      .card {
        margin: 16px;
        padding: 12px;
        border-radius: 6px;
        
        filter: drop-shadow(0px 3px 2px rgba(0,0,0, 0.2));

        background-color: var(--LightAccent);

        display: flex;
        flex-direction: column;
      }

      .card>*:not(a) {
        padding: 0 6px;
      }

      a {
        color: var(--DarkAccent);
        font-size: 1.8em;
        transition: all 250ms linear;
      }

      a:hover {
        filter: brightness(80%);
      }

      @media all and (max-width: 1000px) {
        * {
          --GutterWidth: 12px;
          --CodeblockOffset: 12px;
          --ParagraphOffset: 12px;
        }
        .launchpad {
          --line-offscreen: true;
        }

        .title {
          flex-direction: column-reverse;
        }
      }

      `];
  }
}
