import { Subscription } from 'rxjs';

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
