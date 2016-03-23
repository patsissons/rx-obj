import { Observable, Scheduler } from 'rxjs';

// import { ReactiveApp } from './ReactiveApp';
import { ReactiveObject } from './ReactiveObject';
// import { ScheduledSubject } from './ScheduledSubject';
import { ReactivePropertyValueChanged } from './ReactivePropertyValueChanged';
// import { Unit } from './Unit';

import { ReactiveState } from './ReactiveState';

export class ReactivePropertyState<TSender extends ReactiveObject, TValue> extends ReactiveState<TSender, ReactivePropertyValueChanged<TSender, TValue>> {
  constructor(protected sender: TSender, protected source: Observable<TValue>, initialValue?: TValue, scheduler = Scheduler.queue) {
    super(sender, Scheduler.queue);

    this.source
      .distinctUntilChanged()
      .subscribe(x => {
        this.changingSubject.next(new ReactivePropertyValueChanged(this.sender, this._lastValue));
        // this.sender.raisePropertyChanging();

        this._lastValue = x;

        this.changedSubject.next(new ReactivePropertyValueChanged(this.sender, x));
        // this.sender.raisePropertyChanged();
      }, this.thrownErrorsSubject.next);

    this._lastValue = initialValue;
  }

  private _lastValue: TValue;

  get value() {
    return this._lastValue;
  }
}
