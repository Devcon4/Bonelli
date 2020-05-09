//@ts-ignore
import goTraining from '../md/go-training.md';
//@ts-ignore
import litElement from '../md/lit-element.md';
//@ts-ignore
import kubernetesIntro from '../md/kubernetes-training.md';

import { PostType } from '../main';
export const posts: Array<PostType> = [
  {
    path: 'post/go-training-intro',
    name: 'Introduction to Go!',
    description: 'An introduction to the Go programming language! The basics of the language and simple web endpoints.',
    publishDate: new Date(2020, 3, 26),
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
    publishDate: new Date(2020, 4, 22),
    data: kubernetesIntro
  },
];
