import { Subscription, Scheduler } from 'rxjs';

import { ReactiveProperty } from './ReactiveProperty';

export class ReactiveObject extends Subscription {
  public get changing() {
    return this.getChangingObservable();
  }

  public get changed() {
    return this.getChangedObservable();
  }

  public get thrownErrors() {
    return this.getThrownErrorsObservable();
  }
}
