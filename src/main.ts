import {
  LitElement,
  customElement,
  html,
  query,
  PropertyValues,
  css,
} from 'lit-element';
import { RouterSlot, IRoute } from 'router-slot';
import 'router-slot';
import bootstrap from './BootstrapHoudini';
import { globalStyles, flexHostStyles } from './services/globalStyles';

const routes: Array<IRoute> = [
  {
    path: 'launchpad',
    component: () => import('./components/launchpad.component'),
  },
  {
    path: '**',
    redirectTo: 'launchpad',
  },
];

@customElement('bn-app')
export class AppComponent extends LitElement {
  @query('router-slot') $routerSlotRef!: RouterSlot;

  firstUpdated(props: PropertyValues) {
    super.firstUpdated(props);
    this.$routerSlotRef.add(routes);
    bootstrap();
  }
  
  static get styles() {
    return [
      globalStyles,
      flexHostStyles,
      css``
    ]
  }

  render() {
    return html`<div class="app bn-flex"><router-slot class="bn-flex"></router-slot></div>`;
  }
}
