# What is Reactive Extensions and how does it work?
---

So you've probably heard about Reactive Extensions before, maybe you heard that Angular uses it, or you know that it's uses the Observer pattern. But what is Rx? Well I don't really know either… But I've used it before so maybe I can help.

## A primer

Although Rx has several implementations I will be talking about Rxjs mainly and how you would use it for front-end code. I will also be using Typescript because types are cool, and Rxjs is written in Typescript anyways. Also I don't work on the Rx project or anything, I'm just breaking down source code, I might be wrong about how something is working.

In writing this I decided to break it into two parts, a basic example for people who have no idea what Rx is and a Deep Dive to try to fully understand how Rx works.

![rxjs logo](https://cdn-images-1.medium.com/max/800/1*xLGzalz9I1qV639WsO3rPA.png)

## What is Rx?

Rx is an implementation of the Observer pattern. The high-level idea is that you have a Subject and multiple Observers, when The Subject changes it calls each observer with the new value. In practice you would use Observables instead of Promises for most things. Scary to some people I know, but I would say at least give it a shot before you get your pitchforks. Also Rx has a lot of terms that make it daunting to learn, don't worry we will cover them.

## Basics

Let's just jump into some code and try to make sense of it. Let's start by creating some Observables.

``` typescript
import { of, BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';

// Create observable.
const obs = of([1, 2, 3]);

const sub1 = obs.subscribe(console.log);
const sub2 = obs.pipe(take(1)).subscribe(console.log);
const sub3 = obs.pipe(map(arr => arr[0])).subscribe(console.log);

// output.
// [ 1, 2, 3 ]
// [ 1, 2, 3 ]
// 1
```

Pretty simple, the type of obs is `Observable<number[]>`. We can subscribe to this observable with the `subscribe` keyword. The type of sub1 is `Subscription`. One way to think of it is that an **Observable is a stream of values over time.** And subscriptions are just a bunch of functions that will get called with that new value. Hopefully this is making sense.

Now sub2/sub3 use the `.pipe` function. This is how you call Operators. **An Operator is a function that takes an Observable and return a new Observable.** You can use these to change values before they are passed into your subscribe function (or to not even call your subscribe).

sub2 is interesting because it doesn't look like it does anything. Remember at this point we are working on the stream of values not the values themselves. What this is saying is to take the first event in the stream, then forget the rest. So if obs was updated to use `[4, 5, 6]` our output would be this.

```
[4, 5, 6]
4
```

Only sub1 and sub3 where actually called! Now this might sound way more complicated than it needs to be, but don't worry Rxjs is only as complicated as you make it.

The last thing before we start breaking things down and hopefully it has already clicked is how we change the value with the map pipe before it is passed to the subscribe function. **Also notice that we don't affect the other subscriptions even though we are changing the value.** Rxjs tries to be as immutable as possible (and so should you!).

Alright we made it, Let's try to understand what some of these terms mean and how they relate. Note: *I'm going to jump into some source code now for a deeper look into how Rxjs works, if you're not familiar with Rx already this might be too much.*

---
## Observable

Observable is the core object you will hear about when talking about Rx. Let's look at its source.
[ReactiveX/rxjs](https://medium.com/r/?url=https%3A%2F%2Fgithub.com%2FReactiveX%2Frxjs%2Ftree%2Fmaster%2Fsrc%2Finternal)

First observations:
- Observable implements Subscribable
- Its constructor can takes a subscriber
- Subscribe takes the next/error/complete funcs we talked about.
- Subscribe can also take a PartialObservable instead of a next func.
- Pipe takes any number of operators.

So an Observable is something you can subscribe to and apply operators to. Cool! But I think we need more to really start understanding how Rx works.

Let's look at Subjects.

## Subject/BehaviorSubject

Now observables are cool but they are lacking some features we want. We can't tell an observable a new value to use. Our subscription also only get new values, so if we subscribe after a value was passed we don't get called.

There are several Subjects but the main ones I want to talk about are just Subject and BehaviorSubject. Their inheritance looks something like this.

```
Observable < Subject < BehaviorSubject
```

Subject inherits Observable, and BehaviorSubject inherits from Subject. Let's look at them.

``` typescript
export class BehaviorSubject<T> extends Subject<T> {
  getValue(): T {}
}
```

``` typescript
export class Subject<T> extends Observable<T> implements SubscriptionLike {
  observers: Observer<T>[] = [];
  next(value?: T) { }
}
```

Pretty simple, Both do have more going on but the Next/GetValue function is really all we care about. The gist of it is that I can call next on both to set the next value in the stream, and get the current value on BehaviorSubject.

Now there is one interesting thing, an observer array, why would a subject have that but not an Observable? This is what people are talking about when they say **Hot vs Cold Observables!**

Our example above was a Cold Observable, meaning that it is called once then completes. **Because an Observable can only have it's Initial value we don't need a reference to subscribers!** We will just call them immediately. But for Subjects we have an actual stream so we keep a reference so we can call the Subscriber when changes happen.

Because BehaviorSubjects store their previous value they are perfect for storing state in an application. We can have a Http call fetch data and store it in some state, then when multiple components need to use the same data we don't have to have multiple data calls.

Note: *I will make a post talking about State Management in the future, It's a very interesting topic I would like to dive more into.*

## Subscriber/Subscription

Now subscriber is a mostly internal type so most people never talk about it. but I think it is one of the most interesting and crucial pieces to understanding some of the weirder things you can do with Rxjs.

We will also look at Subscription. They are important but simple, if you remember it is what the Subscribe function returns.

``` typescript
/**
 * Implements the {@link Observer} interface and extends the
 * {@link Subscription} class. While the {@link Observer} is the public API for
 * consuming the values of an {@link Observable}, all Observers get converted to
 * a Subscriber, in order to provide Subscription-like capabilities such as
 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
 * implementing operators, but it is rarely used as a public API.
 *
 * @class Subscriber<T>
 */
export class Subscriber<T> extends Subscription implements Observer<T> {
   constructor(destinationOrNext?: PartialObserver<any> | ((value: T) => void),
              error?: (e?: any) => void,
              complete?: () => void) {}
   
   next(value?: T): void {}
   error(err?: any): void {}
   complete(): void {}

   unsubscribe(): void {}
}
```

``` typescript
/**
 * Represents a disposable resource, such as the execution of an Observable. A
 * Subscription has one important method, `unsubscribe`, that takes no argument
 * and just disposes the resource held by the subscription.
 *
 * Additionally, subscriptions may be grouped together through the `add()`
 * method, which will attach a child Subscription to the current Subscription.
 * When a Subscription is unsubscribed, all its children (and its grandchildren)
 * will be unsubscribed as well.
 *
 * @class Subscription
 */
export class Subscription implements SubscriptionLike {
  unsubscribe(): void {}
}
```

Again let's take some notes:

- It Extends Subscription and implements Observer.
- Its constructor is the exact same as the Observable Subscribe func!

So remember how we had an Observer array on Subjects? All Observers get converted to Subscribers! This is what makes them so important, they are the link in between an Observable and a Subscription.

lastly Subscription is important but not complicated. It helps us keep track of observers and gives us a way to cleanup when we don't want it anymore.

## Wrapping up
Hopefully that helps shed some light on the basics of Rx and why it works how it does. Let's summarize.

Observable: Core Object in Rx; Has `Subscribe()`

Subject: Extends Observable; Has `Next()`

BehaviorSubject: Extends Subject; Has `GetValue()`

Subscription: Result of `Subscribe()` Has `Unsubscribe()`
