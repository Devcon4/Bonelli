import { ReactiveElement } from 'lit';
import { Observable, Subject, takeUntil, tap } from 'rxjs';

// Type helpers.
type Constructor<T> = {
  new (...args: any[]): T;
};
type DestroySub = { $destroy: Subject<boolean> };
function hasDestory<k extends unknown>(kind: k): kind is k & DestroySub {
  return (<k & DestroySub>kind).$destroy !== undefined;
}
function isClassElement(target: unknown): target is ClassElement {
  return (<ClassElement>target).descriptor !== undefined;
}

// Types from https://github.com/lit/lit/blob/8bb33c882bf5a9a215efac9dd9dd8665285a417d/packages/reactive-element/src/decorators/property.ts#L16
// We build to the non-legacy decorator spec. Lit doesn't support legacy decorator format.
// These types are from the TC39 Decorator proposal https://github.com/tc39/proposal-decorators/blob/master/README.md#2-calling-decorators

// From the TC39 Decorators proposal.
export interface ClassElement {
  kind: 'field' | 'method';
  key: PropertyKey;
  placement: 'static' | 'prototype' | 'own';
  initializer?: Function;
  extras?: ClassElement[];
  finisher?: <T>(clazz: Constructor<T>) => void | Constructor<T>;
  descriptor?: PropertyDescriptor;
}

// These below are some helper decorators to make using rx in lit easier.

// TODO: Assert stream returns the same type as field if possible.
// Async decorator. Decorator that will subscribe to an observable and set the property to it's value when it changes.
// This code is kinda messy. Sense we are using the current decorator spec the type definitions are not correct.
export const async =
  (stream: Observable<unknown>, initValue?: unknown) =>
  (protoOrDescriptor: ReactiveElement, name?: PropertyKey): any => {
    if (isClassElement(protoOrDescriptor)) {
      const descriptor: Partial<ClassElement> = {
        kind: 'field',
        initializer() {
          let self = {};
          self = this;
          self['$destroy'] = new Subject<boolean>();

          // TODO: I haven't verified that this disconnect is calling correctly.
          // This could end up leaving rxjs subs around which would cause memory leaks.
          const initDisconnect = self['disconnectedCallback'];
          self['disconnectedCallback'] = function () {
            if (hasDestory(self)) {
              self.$destroy.next(true);
              self.$destroy.complete();
            }

            initDisconnect.bind(this)();
          };

          const initConnected = this['firstUpdated'];
          self['firstUpdated'] = function () {

            // Sub to stream until we destroy.
            stream
              .pipe(
                takeUntil(self['$destroy']),
                tap((t) => (self[protoOrDescriptor.key] = t))
              )
              .subscribe();
            initConnected.bind(this)();
          };

          if (stream['getValue'] !== undefined && initValue === undefined) {
            return stream['getValue']();
          }

          return initValue;
        },
      };

      return {
        ...protoOrDescriptor,
        ...descriptor,
      };
    }
  };
