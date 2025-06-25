import { css } from 'lit';

export const flexHostStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0px;
  }
`;

export const globalStyles = css`
  a {
    color: var(--cara-on-surface);
    font-weight: 500;
    font-size: 18px;
    /* text-decoration: none; */
    transition: all 150ms linear;
  }

  a:hover {
    transform: translateY(-1px);
    filter: brightness(10%);
    filter: drop-shadow(0 2px 4px rgba(0,0,0,.1));
    color: var(--cara-primary);
  }

  img {
    width: 100%;
  }

  .flex {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0px;
  }

  .fill {
    flex: 1;
  }

  h1,h2 {
    font-weight: 300;
    font-size: 42px;
    margin: 0px;
    /* padding-bottom: 42px; */
  }

  mwc-button {
    --mdc-theme-on-primary: var(--cara-on-primary);
  }
`;

export const fadeinAnimation = css`
  @keyframes fadein {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;