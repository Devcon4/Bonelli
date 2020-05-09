import {
  LitElement,
  customElement,
  html,
  query,
  PropertyValues,
  css,
} from 'lit-element';
import { RouterSlot, IRoute, queryParentRouterSlot } from 'router-slot';
import bootstrap from './services/BootstrapHoudini';
import { globalStyles, flexHostStyles } from './services/globalStyles';

import './components/article.component';
import './components/launchpad.component';

import { posts } from './services/posts';

const routes: Array<IRoute> = [
  {
    path: 'launchpad',
    component: () => import('./components/launchpad.component'),
  },

];

export interface PostType {
  path: string;
  name: string;
  description: string;
  publishDate: Date;
  data: any;
};

for(let post of posts) {
  routes.push({
    path: `${post.path}`,
    component: () => import('./components/article.component'),
    setup: (comp, info) => {
      (comp as any).data = post.data;
    }
  });
}

routes.push({
  path: '**',
  redirectTo: 'launchpad',
  pathMatch: 'full'
});

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
