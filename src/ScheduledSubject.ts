'use strict';

import { Observer, Observable, Subject, Subscription } from 'rxjs';
import { Scheduler } from 'rxjs/Scheduler';

export class ScheduledSubject<T> extends Subject<T> {
  protected defaultObserverSub: Subscription;
  protected observerRefCount = 0;

  constructor(protected scheduler?: Scheduler, defaultObserver?: Observer<T>, defaultObservable?: Observable<T>) {
    super(defaultObserver, defaultObservable);

    if (this.destination) {
      this.defaultObserverSub = this.source
        .observeOn(this.scheduler)
        .subscribe(this.destination);
    }
  }

  subscribe(observer: Observer<T>) {
    if (this.defaultObserverSub) {
      this.defaultObserverSub.unsubscribe();
    }

    ++this.observerRefCount;

    const sub = this.observeOn(this.scheduler).subscribe(observer);

    sub.add(new Subscription(() => {
      if (--this.observerRefCount <= 0 && this.destination != null) {
        this.defaultObserverSub = this.observeOn(this.scheduler).subscribe(this.destination);
      }
    }));

    return sub;
  }
}
