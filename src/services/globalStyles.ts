import { css } from "lit-element";

export const globalStyles = css`
  .bn-flex, html, body {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0px;
  }

  ::selection {
    background: var(--DarkShade)
  }

  ::-moz-selection {
    background: var(--DarkShade)
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

export const flexHostStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0px;
  }
`;

export const codeblockStyles = css`

.hljs {
  display: block;
  overflow-x: auto;
  padding: .5em;
  background: var(--LightAccent);
  filter: drop-shadow(0px 3px 2px rgba(0,0,0, 0.2));
}

.hljs,.hljs-subst {
  color: var(--DarkShade)
}

.hljs-selector-tag {
  color: var(--DarkAccent)
}

.hljs-selector-id {
  color: var(--Main);
  font-weight: 700
}

.hljs-selector-class {
  color: var(--Main)
}

.hljs-selector-attr {
  color: var(--Main)
}

.hljs-selector-pseudo {
  color: var(--Main)
}

.hljs-addition {
  background-color: rgba(163,190,140,.5)
}

.hljs-deletion {
  background-color: rgba(191,97,106,.5)
}

.hljs-built_in,.hljs-type {
  color: var(--Main)
}

.hljs-class {
  color: var(--Main)
}

.hljs-function {
  color: var(--Main)
}

.hljs-function>.hljs-title {
  color: var(--Main)
}

.hljs-keyword,.hljs-literal,.hljs-symbol {
  color: var(--DarkAccent)
}

.hljs-number {
  color: var(--DarkAccent);
}

.hljs-regexp {
  color: #ebcb8b
}

.hljs-string {
  color: var(--Main)
}

.hljs-title {
  color: var(--Main)
}

.hljs-params {
  color: var(--DarkShade)
}

.hljs-bullet {
  color: var(--DarkAccent)
}

.hljs-code {
  color: var(--Main)
}

.hljs-emphasis {
  font-style: italic
}

.hljs-formula {
  color: var(--Main)
}

.hljs-strong {
  font-weight: 700
}

.hljs-link:hover {
  text-decoration: underline
}

.hljs-quote {
  color: #4c566a
}

.hljs-comment {
  color: #4c566a
}

.hljs-doctag {
  color: var(--Main)
}

.hljs-meta,.hljs-meta-keyword {
  color: var(--DarkAccent);
}

.hljs-meta-string {
  color: var(--Main)
}

.hljs-attr {
  color: var(--DarkShade)
}

.hljs-attribute {
  color: var(--DarkShade)
}

.hljs-builtin-name {
  color: var(--DarkAccent)
}

.hljs-name {
  color: var(--DarkAccent)
}

.hljs-section {
  color: var(--Main)
}

.hljs-tag {
  color: var(--DarkAccent)
}

.hljs-variable {
  color: var(--DarkShade)
}

.hljs-template-variable {
  color: var(--DarkShade)
}

.hljs-template-tag {
  color: var(--DarkAccent);
}

.abnf .hljs-attribute {
  color: var(--Main)
}

.abnf .hljs-symbol {
  color: #ebcb8b
}

.apache .hljs-attribute {
  color: var(--Main)
}

.apache .hljs-section {
  color: var(--DarkAccent)
}

.arduino .hljs-built_in {
  color: var(--Main)
}

.aspectj .hljs-meta {
  color: #d08770
}

.aspectj>.hljs-title {
  color: var(--Main)
}

.bnf .hljs-attribute {
  color: var(--Main)
}

.clojure .hljs-name {
  color: var(--Main)
}

.clojure .hljs-symbol {
  color: #ebcb8b
}

.coq .hljs-built_in {
  color: var(--Main)
}

.cpp .hljs-meta-string {
  color: var(--Main)
}

.css .hljs-built_in {
  color: var(--Main)
}

.css .hljs-keyword {
  color: #d08770
}

.diff .hljs-meta {
  color: var(--Main)
}

.ebnf .hljs-attribute {
  color: var(--Main)
}

.glsl .hljs-built_in {
  color: var(--Main)
}

.groovy .hljs-meta:not(:first-child) {
  color: #d08770
}

.haxe .hljs-meta {
  color: #d08770
}

.java .hljs-meta {
  color: #d08770
}

.ldif .hljs-attribute {
  color: var(--Main)
}

.lisp .hljs-name {
  color: var(--Main)
}

.lua .hljs-built_in {
  color: var(--Main)
}

.moonscript .hljs-built_in {
  color: var(--Main)
}

.nginx .hljs-attribute {
  color: var(--Main)
}

.nginx .hljs-section {
  color: var(--DarkAccent);
}

.pf .hljs-built_in {
  color: var(--Main)
}

.processing .hljs-built_in {
  color: var(--Main)
}

.scss .hljs-keyword {
  color: var(--DarkAccent)
}

.stylus .hljs-keyword {
  color: var(--DarkAccent)
}

.swift .hljs-meta {
  color: #d08770
}

.vim .hljs-built_in {
  color: var(--Main);
  font-style: italic
}

.yaml .hljs-meta {
  color: #d08770
}


`;
