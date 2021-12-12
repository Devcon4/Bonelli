import { IRoute } from 'router-slot';
import { BehaviorSubject, combineLatest, map, of } from 'rxjs';
import { IArticle } from '../components/article.component';
import postState, { PostType } from './postState';

const routes: Array<IRoute> = [
  {
    path: 'home',
    component: async () => await import('../components/example')
  },
  {
    path: 'launchpad',
    component: async () => await import ('../components/launchpad.component')
  },  
];

function mapRoutes(posts: PostType[]): IRoute[] {
  return [
    ...posts.map<IRoute>(p => ({
      path: `post/${p.path}`,
      component: async () => await import('../components/article.component'),
      setup: c => (c as unknown as IArticle).data = p.data
    })),
  ];
}

class RouteState {
  public staticRoutes = new BehaviorSubject<IRoute[]>(routes);
  public postRoutes = postState.posts.pipe(map((p) => mapRoutes(p)));
  public redirectRoute = of<IRoute[]>([{
    path: '**',
    redirectTo: 'launchpad',
    pathMatch: 'full',
  }])

  public routes = combineLatest([this.staticRoutes, this.postRoutes, this.redirectRoute]).pipe(map(l => l.flat()))
}

const routeState = new RouteState();
export default routeState;