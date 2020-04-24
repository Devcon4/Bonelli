import {
  LitElement,
  customElement,
  html,
  query,
  PropertyValues,
} from 'lit-element';
import { RouterSlot, IRoute } from 'router-slot';
import 'router-slot';
import bootstrap from './BootstrapHoudini';

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

  render() {
    return html`<div class="app"><router-slot></router-slot></div>`;
  }
}
