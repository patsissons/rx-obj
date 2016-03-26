import { Observable, Scheduler } from 'rxjs';

import { ReactiveObject } from './ReactiveObject';
import { ReactiveProperty } from './ReactiveProperty';
import { ReactivePropertyValueChanged } from './ReactivePropertyValueChanged';
import { ReactiveState } from './ReactiveState';

export class ReactivePropertyState<TSender extends ReactiveObject, TValue> extends ReactiveState<TSender, ReactivePropertyValueChanged<TSender, TValue>> {
  constructor(protected sender: TSender, protected property: ReactiveProperty<TSender, TValue>, protected source: Observable<TValue>, initialValue?: TValue, scheduler = Scheduler.queue) {
    super(sender, Scheduler.queue);

    this.source
      .distinctUntilChanged()
      .subscribe(x => {
        this.changingSubject.next(new ReactivePropertyValueChanged(this.sender, this._lastValue));
        this.sender.raisePropertyChanging(this.property);

        this._lastValue = x;

        this.changedSubject.next(new ReactivePropertyValueChanged(this.sender, x));
        this.sender.raisePropertyChanged(this.property);
      }, this.thrownErrorsSubject.next);

    this._lastValue = initialValue;
  }

  private _lastValue: TValue;

  get value() {
    return this._lastValue;
  }
}
