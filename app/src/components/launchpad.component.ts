import { css, html, LitElement } from "lit";
import { customElement, state } from 'lit/decorators.js';
import { async } from '../services/decoratorUtils';
import postState, { PostType } from '../services/postState';
import { fadeinAnimation, flexHostStyles, globalStyles } from "../styles/globalStyles";
import './banner.component';
import './rule.component';
import './subheading.component';

@customElement('bn-launchpad')
export default class LaunchpadComponent extends LitElement {
  
  @state()
  @async(postState.posts)
  posts: PostType[] = [];

  render() {
    return html`
    <div class="launchpad bn-flex">
      <bn-banner text="Cyphers.dev" showToggle></bn-banner>
      <bn-rule lockMargin></bn-rule>
      ${this.newestPost()}
      <bn-subheading text="All Posts"></bn-subheading>
      ${Object.entries(this.posts)
        .sort((a, b) => a[1].publishDate > b[1].publishDate ? -1 : 1)
        .map(([path, val]) => this.card(val))
      }
    </div>`;
  }

  newestPost() {
    let checkDate = new Date();
    // show Within the last month
    checkDate.setMonth(checkDate.getMonth() - 1);

    let newestPost = Object.entries(this.posts)
      .sort((a, b) => a[1].publishDate > b[1].publishDate ? -1 : 1)
      .filter(([path, val]) => val.publishDate > checkDate)
      .map(([path, val]) => val);
    console.log(newestPost);
    if(newestPost.length > 0) {
      return html`
        <bn-subheading text="Newest Post"></bn-subheading>
        ${this.card(newestPost[0])}
      `;
    }
  }

  card(post: PostType) {
    let formatDate = post.publishDate.toDateString();

    return html`
      <div class="wrapper">
        <div class="card">
          <div class="title">
            <a href="post/${post.path}"><h3>${post.name}</h3></a>
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
        --line-background: var(--bnli-background);
        --line-color-left: var(--light, var(--bnli11)) var(--dark, var(--bnli7));
        --line-color-center: var(--light, var(--bnli13)) var(--dark, var(--bnli9));
        --line-color-right: var(--light, var(--bnli2)) var(--dark, var(--bnli4));
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
        font-size: 1.4rem;
        
        filter: drop-shadow(0px 3px 2px rgba(0,0,0, 0.2));

        background-color: var(--bnli-surface);

        display: flex;
        flex-direction: column;
        max-width: 1080px;
      }

      .card>*:not(a) {
        padding: 0 6px;
      }

      a {
        color: var(--bnli-primary);
        font-size: 2rem;
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
