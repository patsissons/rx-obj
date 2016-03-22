'use strict';

import { Observer, Observable, Subject, Subscription, Operator } from 'rxjs';
import { Scheduler } from 'rxjs/Scheduler';
import { SubjectSubscription } from 'rxjs/subject/SubjectSubscription';

export class ScheduledSubject<T> extends Subject<T> {
  protected defaultObserverSub: Subscription;
  protected observerRefCount = 0;

  constructor(protected scheduler?: Scheduler, defaultObserver?: Observer<T>, defaultSubject = new Subject<T>()) {
    super(defaultObserver, defaultSubject);

    this.add(this.subject);

    this.subscribeDefault();
  }

  protected subscribeDefault() {
    if (this.destination) {
      this.defaultObserverSub = this.subject
        .observeOn(this.scheduler)
        .subscribe(this.destination);
    }
  }

  protected get subject() {
    return <Subject<T>>this.source;
  }

  get observers() {
    return this.subject.observers;
  }

  set observers(value: Observer<T>[]) {
    this.subject.observers = value;
  }

  lift<T, R>(operator: Operator<T, R>) {
    return this.subject.lift(operator);
  }

  next(value: T) {
    this.subject.next(value);
  }

  error(err?: any) {
    this.subject.error(err);
  }

  complete() {
    this.subject.complete();
  }

  asObservable() {
    return this.subject.asObservable();
  }

  subscribe(observer: Observer<T>) {
    if (this.defaultObserverSub) {
      this.defaultObserverSub.unsubscribe();
      this.defaultObserverSub = undefined;
    }

    ++this.observerRefCount;

    const sub = this.subject
      .observeOn(this.scheduler)
      .subscribe(observer);

    sub.add(new Subscription(() => {
      if (--this.observerRefCount <= 0) {
        this.observerRefCount = 0;

        this.subscribeDefault();
      }
    }));

    return sub;
  }
}
