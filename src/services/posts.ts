//@ts-ignore
import goTraining from '../md/go-training.md';
//@ts-ignore
import litElement from '../md/lit-element.md';
//@ts-ignore
import kubernetesIntro from '../md/kubernetes-training.md';
//@ts-ignore
import rxjsDeepDive from '../md/rxjs-dive.md';
//@ts-ignore
import csharpNineExplainer from '../md/csharp-nine-explainer.md';

import { PostType } from '../main';
export const posts: Array<PostType> = [
  {
    path: 'post/go-training-intro',
    name: 'Introduction to Go!',
    description: 'An introduction to the Go programming language! The basics of the language and simple web endpoints.',
    publishDate: new Date(2020, 2, 26),
    data: goTraining
  },
  {
    path: 'post/lit-element-intro',
    name: 'About this blog',
    description: 'Break-down of the stack that this website is using. Intro to Lit-Element and how it is running on Kubernetes.',
    publishDate: new Date(2020, 0, 16),
    data: litElement
  },
  {
    path: 'post/kubernetes-intro',
    name: 'A primer for Kubernetes',
    description: 'What is Kubernetes and why should we use it? Looking at some of the basic ideas of k8s and serve some simple apps.',
    publishDate: new Date(2020, 3, 22),
    data: kubernetesIntro
  },
  {
    path: 'post/rxjs-deep-dive',
    name: 'What is Reactive Extensions and how does it work?',
    description: 'So you\'ve probably heard about Reactive Extensions before, maybe you heard that Angular uses it, or you know that it\'s uses the Observer pattern. But what is Rx? Well I don\'t really know either… But I\'ve used it before so maybe I can help.',
    publishDate: new Date(2019, 2, 12),
    data: rxjsDeepDive
  },
  {
    path: 'post/csharp-nine-explainer',
    name: 'New features in C# 9.0',
    description: 'A rundown of new features added to C# 9.0. Record types, init only setters, top-level statements ohh my!',
    publishDate: new Date(2020, 9, 13),
    data: csharpNineExplainer
  }
];
