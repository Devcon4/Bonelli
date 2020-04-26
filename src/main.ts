import {
  LitElement,
  customElement,
  html,
  query,
  PropertyValues,
  css,
} from 'lit-element';
import { RouterSlot, IRoute, queryParentRouterSlot } from 'router-slot';
import 'router-slot';
import bootstrap from './services/BootstrapHoudini';
import { globalStyles, flexHostStyles } from './services/globalStyles';
import { readFileSync, readdir } from 'fs';
import { basename } from 'path';

import './components/article.component';
import './components/launchpad.component';

//@ts-ignore
import goTraining from './md/go-training.md';
//@ts-ignore
import litElement from './md/lit-element.md';
//@ts-ignore
import kubernetesIntro from './md/kubernetes-training.md';

const routes: Array<IRoute> = [
  {
    path: 'launchpad',
    component: () => import('./components/launchpad.component'),
  },

];

export const posts = [
  {
    path: 'post/go-training-intro',
    name: 'Introduction to Go!',
    data: goTraining
  },
  {
    path: 'post/lit-element-intro',
    name: 'About this blog',
    data: litElement
  },
  {
    path: 'post/kubernetes-intro',
    name: 'A primer for Kubernetes 🚀',
    data: kubernetesIntro
  }
];

for(let post of posts) {
  routes.push({
    path: `${post.path}`,
    component: () => import('./components/article.component'),
    setup: (comp, info) => {
      (comp as any).data = post.data;
    }
  });
}


@customElement('bn-app')
export class AppComponent extends LitElement {
  @query('router-slot') $routerSlotRef!: RouterSlot;


  get data() {
    return queryParentRouterSlot(this)
  }

  firstUpdated(props: PropertyValues) {
    super.firstUpdated(props);
    this.$routerSlotRef.add(routes);
    bootstrap();
    
    document.body.style.setProperty('--GutterWidth', 50 + (64 * 2) + (12 * 3) + 'px' ); // These numbers correlate to how many and how thick the lines drawn are.
    
  }

  render() {
    return html`<div class="app bn-flex"><router-slot class="bn-flex"></router-slot></div>`;
  }

  static get styles() {
    return [
      globalStyles,
      flexHostStyles,
      css``
    ]
  }
}
