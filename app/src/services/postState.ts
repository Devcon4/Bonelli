import { BehaviorSubject } from 'rxjs';

export interface PostType {
  path: string;
  name: string;
  description: string;
  publishDate: Date;
  data: () => Promise<typeof import("*.md")>;
}

const posts: Array<PostType> = [
  {
    path: 'go-training-intro',
    name: 'Introduction to Go!',
    description: 'An introduction to the Go programming language! The basics of the language and simple web endpoints.',
    publishDate: new Date(2020, 2, 26),
    data: async () => await import('../md/go-training.md')
  },
  {
    path: 'lit-element-intro',
    name: 'About this blog',
    description: 'Break-down of the stack that this website is using. Intro to Lit-Element and how it is running on Kubernetes.',
    publishDate: new Date(2020, 0, 16),
    data: async () => await import('../md/lit-element.md')
  },
  {
    path: 'kubernetes-intro',
    name: 'A primer for Kubernetes',
    description: 'What is Kubernetes and why should we use it? Looking at some of the basic ideas of k8s and serve some simple apps.',
    publishDate: new Date(2020, 3, 22),
    data: async () => await import('../md/kubernetes-training.md')
  },
  {
    path: 'rxjs-deep-dive',
    name: 'What is Reactive Extensions and how does it work?',
    description: 'So you\'ve probably heard about Reactive Extensions before, maybe you heard that Angular uses it, or you know that it\'s uses the Observer pattern. But what is Rx? Well I don\'t really know either… But I\'ve used it before so maybe I can help.',
    publishDate: new Date(2019, 2, 12),
    data: async () => await import('../md/rxjs-dive.md')
  },
  {
    path: 'csharp-nine-explainer',
    name: 'New features in C# 9.0',
    description: 'A rundown of new features added to C# 9.0. Record types, init only setters, top-level statements ohh my!',
    publishDate: new Date(2020, 9, 13),
    data: async () => await import('../md/csharp-nine-explainer.md')
  },
  {
    path: 'build-tool-basics-rollup',
    name: 'Build tool basics: Rollup.js',
    description: 'A look at what it means to bundle a modern website, in particular how to use Rollup.js. What is Rollup and why would I use it?',
    publishDate: new Date(2021, 3, 19),
    data: async () => await import('../md/build-tool-basics-rollup.md')
  }
];

class PostState {
  posts = new BehaviorSubject<PostType[]>(posts);
}

// Singleton setup.
const postState = new PostState();
export default postState;
