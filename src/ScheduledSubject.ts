'use strict';

import { Observer, Observable, Subject, Subscription } from 'rxjs';
import { Scheduler } from 'rxjs/Scheduler';

export class ScheduledSubject<T> implements Observer<T>, Subscription {
  protected subject: Subject<T> = null;
  protected defaultObserverSub: Subscription = null;
  protected observerRefCount = 0;

  constructor(protected scheduler: Scheduler, protected defaultObserver?: Observer<T>, defaultSubject?: Subject<T>) {
    this.subject = defaultSubject || new Subject<T>();

    if (this.defaultObserver != null) {
      this.defaultObserverSub = this.subject
        .observeOn(this.scheduler)
        .subscribe(this.defaultObserver);
    }
  }

  get isUnsubscribed() {
    return this.subject.isUnsubscribed;
  }

  add(subscription: Subscription | Function | void) {
    this.subject.add(subscription);
  }

  remove(subscription: Subscription) {
    this.subject.remove(subscription);
  }

  unsubscribe() {
    if (this.subject.isUnsubscribed === false) {
      this.subject.unsubscribe();
    }
  }

  complete() {
    this.subject.complete();
  }

  error(err?: any) {
    this.subject.error(err);
  }

  next(value: T) {
    this.subject.next(value);
  }

  subscribe(observer: Observer<T>) {
    if (this.defaultObserverSub != null) {
      this.defaultObserverSub.unsubscribe();
    }

    ++this.observerRefCount;

    let sub = this.subject.observeOn(this.scheduler).subscribe(observer);
    sub.add(new Subscription(() => {
      if (--this.observerRefCount <= 0 && this.defaultObserver != null) {
        this.defaultObserverSub = this.subject.observeOn(this.scheduler).subscribe(this.defaultObserver);
      }
    }));

    return sub;
  }
}
