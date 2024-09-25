# Modern Angular with Signals
---

In recent years the Angular team has made many new changes and improvements. As good stewards it is always important to review current practices and validate if they are still relevant as the tooling we use evolves.

## What are Signals?

Signals is Angular's new state management pattern. A "signal" is a pattern for tracking reactive changes to state. React Hooks also follow the signal pattern. This is an alternative to flux architectures or other unordered state patterns. Lets get a basic idea about how they work and how we can use them.

At its core a signal is a wrapper around a chunk of state, usually a single property or object, with a producer/consumer pattern. Under the hood it uses a dependency graph in order to track how changes trickle down to dependents. Lets look at some usages.

``` Typescript
import { Component, computed, effect, signal } from '@angular/core';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [],
  template: `
    <p>Status: {{statusName()}}</p>
    <button (click)="toggle()">Toggle</button>
  `
})
export class StatusComponent {

  // This is the root signal.
  enabled = signal(false);

  // This is a computed value that will update whenever the enabled signal changes
  statusName = computed(() => this.enabled() ? 'Enabled' : 'Disabled');

  constructor() {
    // This is a side effect that will run whenever the statusName changes
    effect(() => {
      console.log(`Status: ${this.statusName()}`);
    });
  }

  toggle() {
    // This will update the enabled signal
    this.enabled.set(!this.enabled());
  }
}

```

This has quite a bit going on but lets break it down so it is easier to digest. The core part of this is the `enabled` signal. This is the only actual state in the component. To get the value of the signal we call it `enabled()`. Angular is smart enough to know when we call it and track its updates in order to update DOM. Technically this is a `WritableSignal` which means it has the `set` function that we can call to update the state.

Next we have `statusName` which is a computed property. The computed function returns a new readonly signal which updates when any signals in the computed function are updated. This can be used to map signals like this example, combine multiple signals into one, or a number of other useful operations.

There is also the special case effect declared in the constructor. This is basically a function that watches any used signals and runs this method whenever they update. This example will log anytime statusName updates.

**⚠️ Note: Signals use a diff mechanism in order to cascade changes. This means that Computed and Effect will only be called if the state is different from the last time it ran!**

Finally we use the `enabled.set` function to update the original signal state. This is pretty straight forward but will cascade that change down the dependency graph.

## Using signals as component Inputs and Outputs
---

Now that we have a basic understanding of what a signal is and how to use it lets look at another key usage, as Input or Output properties of a component.

``` Typescript
export type CardOptions = {
  color: 'blue' | 'red' | 'green';
};

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  template: `
  @let desc = description();

  <div class="card" [style.color]="options().color">
    <div class="title">{{titleCapitalized()}}</div>
    @if (desc) {
      <div class="description">{{desc}}</div>
    }
  </div>
  `
})
export default class CardComponent {
  // This is a required input, we also alias it to cardTitle
  title = input.required<string>({alias: 'cardTitle'});
  // This is an optional input which defaults to undefined
  description = input<string | undefined>();
  // Another optional input for an object with a default value
  options = input<CardOptions>({color: 'blue'});
  // This is a computed value that will update whenever the title input changes
  titleCapitalized = computed(() => this.title().toUpperCase());
}
```

In this example we have three inputs, one of which are required. We can use these Inputs the same way we use any Signal. Computed signals will track our input changing. We can pass default values to the input or alias the component attribute name. Signal style inputs are a complete replacement of decorator based `@input()` properties. Other than being a signal they also provide better type safety. Here is an example usage of the above component to give a more complete example.

``` Typescript
type Card = {
  title: string;
  description?: string;
  options: CardOptions;
};

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CardComponent],
  template: `
  <div class="list">
    @for (card of cards(); track card.title) {
      <app-card [cardTitle]="card.title" [description]="card.description" [options]="card.options"></app-card>
    }
  </div>

  <button (click)="addCard(nextCard())">Add Card</button>
  `
})
export default class ListComponent {
  cards = signal<Card[]>([
    {title: 'Card 1', description: 'Description 1', options: {color: 'blue'}},
    {title: 'Card 2', description: 'Description 2', options: {color: 'red'}},
    {title: 'Card 3', description: 'Description 3', options: {color: 'green'}}
  ]);

  nextCard = computed<Card>(() => {
    const cards = this.cards();
    return {
      title: `Card ${cards.length + 1}`,
      options: {color: 'blue'}
    };
  });

  addCard(card: Card) {
    this.cards.set([...this.cards(), card]);
  }
}

```

## RXJS Interop
---

If you are familiar with the current state of Angular you will know that rxjs is a vital part of building angular apps. With the recent introduction of Signals you may be wondering how it fits into the current usage of rxjs. Signals is not an rxjs replacement. Both tools serve different purposes and needs. both tools are designed around the concept of Reactivity, this is the idea that we should think of state as being more dynamic and flowing through an application.

Some history, as Angular matured and developers learned how to better use observable pattern people have been asking for a larger embrace of reactive control flow in angular. For example allowing component Input/Outputs to be Observable objects. As well as the OnPush ChangeDetectionStrategy which requires all component state to be a reactive object. Signals were not born as a replacement to remove rxjs rather as a tool to help those who embraced rxjs and 'Reactive Angular' patterns.

This is where rxjs-interop comes into play. These are a collection of functions that make it easy to convert to and from signals and observables. Lets take a look at some examples.

``` Typescript

@Injectable({
  providedIn: 'root',
})
export class SiteState {
  readonly client = inject(HttpClient);
  readonly sites = new BehaviorSubject<Site[] | undefined>(undefined);

  // A real implementation would fetch data from a server using the HttpClient
  search(query: string) {
    this.sites.next(undefined);
    const sites = this.siteData.map((site) => {
      const relavance = site.name
        .split('')
        .filter((char) => query.includes(char)).length;
      return { ...site, relavance };
    });
    this.sites.next(sites);
  }

  private siteData: Site[] = [
    { name: 'Google', url: 'https://google.com', description: 'Search engine', relavance: 0, },
    { name: 'Facebook', url: 'https://facebook.com', description: 'Social media', relavance: 0, },
    { name: 'YouTube', url: 'https://youtube.com', description: 'Video sharing', relavance: 0, },
  ];
}

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    @let results = filteredSignal();

    <div class="page">
      <h3>Search</h3>
      <input type="text" placeholder="Search" [formControl]="searchControl" />

      <div class="results">
        @for (site of results; track site.name) {
        <div class="site">
          <h3>{{ site.name }}</h3>
          <p>{{ site.description }}</p>
          <a [href]="site.url">Visit Site</a>
        </div>
        } @empty {
        <p>No results</p>
        }
      </div>
    </div>
  `,
})
export default class SearchPageComponent {
  readonly siteState = inject(SiteState);
  readonly searchControl = new FormControl<string>('');

  // An input signal.
  sortOrder = input<'asc' | 'desc'>('desc');

  // an output event of the current search query.
  searchQuery = outputFromObservable(this.searchControl.valueChanges);

  // Turn sites BehaviorSubject to a signal.
  siteSignal = toSignal(this.siteState.sites, { initialValue: [] });
  // Computed signal which sorts with out input signal.
  sortedSites = computed(() =>
    this.siteSignal()?.sort((a, b) => {
      const sort = a.relavance - b.relavance;
      return this.sortOrder() === 'asc' ? sort : -sort;
    })
  );

  // Observable which watches our formControl and calls search when it changes, debounced.
  queryChanges = this.searchControl.valueChanges.pipe(
    debounceTime(200),
    filter(Boolean),
    tap(q => this.siteState.search(q))
  );

  // Combines our query obs and our computed signal as an observable.
  filteredSites = combineLatest([
    toObservable(this.sortedSites),
    this.queryChanges,
  ]).pipe(
    map(([sites, query]) =>
      sites?.filter((site) => site.name.match(new RegExp(query, 'i')))
    ),
  );

  // Turn our resulting filtered obs into a signal to render.
  filteredSignal = toSignal(this.filteredSites, { initialValue: [] });
}

```

Wow this is a pretty big example, lets break it down. We are using a StateService and a component to show search results. Our state service follows the state pattern I have discussed previously, BehaviorSubjects with actions to update them. Lets look more at that component.

First we have some Input/Output bindings. We use `outputFromObservable` to turn our form control value into an output signal. Next we grab our siteState, turning our sites into a signal using `toSignal`. `soretedSites` is a computed signal which watches both of those and sorts our list. We then have an observable which watches our form control and calls search on our state service whenever it changes. Finally we use a CombineLatest to merge both into our final observable. Note how we turn our sortedSites computed signal into an observable stream with `toObservable`.

This isn't a perfect example, we could simplify some of this code in a real world example, but it shows some use cases we might find ourselves in with signals and observables. Lets talk about some observations about this code. First notice how we don't use `| async` anywhere? Instead `toSignal` does some of the similar tracking async would do for us. Also notice how we have minimal raw component state, instead everything is inside a reactive wrapper (observable, signal). Rather than thinking about state as mutations to objects we are able to chain state through operators in a more functional, dynamic way.

## Blocks
---

You may have noticed in the examples above the template syntax looks different than you may be used too. In the past we used `*ngIf, *ngFor, *ngSwitch` which are structural directives. Functionally these still exist but there is an alternative syntax we can use to help make them more clear. These are called Control Flow Blocks, Lets look at some examples.

```typescript

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [],
  template: `
    @let data = detail();
    <h3>Details</h3>

    @if (data) {
      <div>
        <h4>{{data.title}}</h4>
        @switch (data.type) {
          @case ('Main') {
            <b>Main Detail</b>
          }
          @case ('Alt') {
            <p>Alternate Detail</p>
          }
          @default {
            <p>Unknown Detail</p>
          }
        }
        <ul>
          @for (assignment of data.assignments; track assignment.id) {
            <li>{{assignment.user}}</li>
          } @empty {
            <li>No assignments</li>
          }
        </ul>
      </div>
    }

  `
})
export default class DetailsComponent {
  readonly detailService = inject(DetailState);
  readonly detail = toSignal(this.detailService.detail);

  constructor() {
    this.detailService.getDetail();
  }
}

@Injectable({
  providedIn: 'root'
})
export class DetailState {
  readonly detail = new BehaviorSubject<typeof DetailData | undefined>(undefined);

  getDetail() {
    this.detail.next(DetailData);
  }
}

const DetailData = {
  title: 'Detail 1',
  type: 'Main' as 'Main' | 'Alt',
  id: 1,
  assignments: [
    { user: 'User 1', id: 1 },
    { user: 'User 2', id: 2 },
    { user: 'User 3', id: 3 },
  ]
};

```

Lets break down some of these blocks, first lets look at `@let`. This is a new block and it lets you store variables to be reused in the DOM. This replaced the `*ngIf ... as variable` syntax we have used previously. It is useful to pull signals to these variables.

`@if` is a basic conditional block. Not shown here but there is also `@else if()` and `@else` which can be chained as a second block.

`@switch` is functionally the same as the old `*ngSwitch` but with this new syntax.

`@for` lets you loop over arrays of data. One interesting change is a track by is required now. There is also the `@empty` block which can be used when the array is falsey ([], null, undefined).

## Conclusion
---

The Angular team has been busy with many new improvements to angular. The full adoption of reactive design is a very welcome change and should lead to clearer code in the future. I was more hesitant of signals when they were first announced but after playing with them and with rxjs-interop they let you write very clean code imo. There is still a lot to learn with best practices with them but they should be able to fit into existing patterns easily.