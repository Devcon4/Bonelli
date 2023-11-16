import { css } from 'lit';

export const codeblockStyles = css`

.hljs {
  display: block;
  overflow-x: auto;
  padding: .5em;
  background: var(--bnli-surface);
  filter: drop-shadow(0px 3px 2px rgba(0,0,0, 0.2));
  color: var(--light, var(--bnli1)) var(--dark, var(--bnli4));
}

.hljs .hljs-subst {
  color: var(--bnli-secondary)
}

.hljs-selector-tag {
  color: var(--bnli-primary)
}

.hljs-selector-id {
  color: var(--bnli-secondary);
  font-weight: 700
}

.hljs-selector-class {
  color: var(--bnli-secondary)
}

.hljs-selector-attr {
  color: var(--bnli-secondary)
}

.hljs-selector-pseudo {
  color: var(--bnli-secondary)
}

.hljs-addition {
  background-color: rgba(163,190,140,.5)
}

.hljs-deletion {
  background-color: rgba(191,97,106,.5)
}

.hljs-built_in,.hljs-type {
  color: var(--bnli-primary)
}

.hljs-class {
  color: var(--bnli-secondary)
}

.hljs-function {
  color: var(--bnli-secondary)
}

.hljs-function>.hljs-title {
  color: var(--bnli-secondary)
}

.hljs-keyword,.hljs-literal,.hljs-symbol {
  color: var(--bnli-primary)
}

.hljs-number {
  color: var(--bnli-primary);
}

.hljs-regexp {
  color: #ebcb8b
}

.hljs-string {
  color: var(--bnli-secondary-variant)
}

.hljs-title {
  color: var(--bnli-secondary)
}

.hljs-params {
  color: var(--light, var(--bnli2)) var(--dark, var(--bnli5))
}

.hljs-bullet {
  color: var(--bnli-primary)
}

.hljs-code {
  color: var(--bnli-secondary)
}

.hljs-emphasis {
  font-style: italic
}

.hljs-formula {
  color: var(--bnli-secondary)
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
  color: var(--bnli-secondary)
}

.hljs-meta,.hljs-meta-keyword {
  color: var(--bnli-primary);
}

.hljs-meta-string {
  color: var(--bnli-secondary)
}

.hljs-attr {
  color: var(--light, var(--bnli2)) var(--dark, var(--bnli5))
}

.hljs-attribute {
  color: var(--light, var(--bnli2)) var(--dark, var(--bnli5))
}

.hljs-builtin-name {
  color: var(--bnli-primary)
}

.hljs-name {
  color: var(--bnli-primary)
}

.hljs-section {
  color: var(--bnli-secondary)
}

.hljs-tag {
  color: var(--bnli-primary)
}

.hljs-variable {
  color: var(--light, var(--bnli2)) var(--dark, var(--bnli5))
}

.hljs-secondarylate-variable {
  color: var(--light, var(--bnli2)) var(--dark, var(--bnli5))
}

.hljs-secondarylate-tag {
  color: var(--bnli-primary);
}

.abnf .hljs-attribute {
  color: var(--bnli-secondary)
}

.abnf .hljs-symbol {
  color: #ebcb8b
}

.apache .hljs-attribute {
  color: var(--bnli-secondary)
}

.apache .hljs-section {
  color: var(--bnli-primary)
}

.arduino .hljs-built_in {
  color: var(--bnli-secondary)
}

.aspectj .hljs-meta {
  color: #d08770
}

.aspectj>.hljs-title {
  color: var(--bnli-secondary)
}

.bnf .hljs-attribute {
  color: var(--bnli-secondary)
}

.clojure .hljs-name {
  color: var(--bnli-secondary)
}

.clojure .hljs-symbol {
  color: #ebcb8b
}

.coq .hljs-built_in {
  color: var(--bnli-secondary)
}

.cpp .hljs-meta-string {
  color: var(--bnli-secondary)
}

.css .hljs-built_in {
  color: var(--bnli-secondary)
}

.css .hljs-keyword {
  color: #d08770
}

.diff .hljs-meta {
  color: var(--bnli-secondary)
}

.ebnf .hljs-attribute {
  color: var(--bnli-secondary)
}

.glsl .hljs-built_in {
  color: var(--bnli-secondary)
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
  color: var(--bnli-secondary)
}

.lisp .hljs-name {
  color: var(--bnli-secondary)
}

.lua .hljs-built_in {
  color: var(--bnli-secondary)
}

.moonscript .hljs-built_in {
  color: var(--bnli-secondary)
}

.nginx .hljs-attribute {
  color: var(--bnli-secondary)
}

.nginx .hljs-section {
  color: var(--bnli-primary);
}

.pf .hljs-built_in {
  color: var(--bnli-secondary)
}

.processing .hljs-built_in {
  color: var(--bnli-secondary)
}

.scss .hljs-keyword {
  color: var(--bnli-primary)
}

.stylus .hljs-keyword {
  color: var(--bnli-primary)
}

.swift .hljs-meta {
  color: #d08770
}

.vim .hljs-built_in {
  color: var(--bnli-secondary);
  font-style: italic
}

.yaml .hljs-meta {
  color: #d08770
}


`;
