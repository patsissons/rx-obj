import { Observable } from 'rxjs';

import { ReactiveObject } from './ReactiveObject';
import { ReactiveProperty } from './ReactiveProperty';
import { ReactivePropertyChanged } from './ReactivePropertyChanged';

import { ReactiveState } from './ReactiveState';

export class ReactiveObjectState<TSender extends ReactiveObject> extends ReactiveState<TSender, ReactivePropertyChanged<TSender, any>> {
  constructor(protected sender: TSender) {
    super(sender);
  }

  dedup(batch: ReactivePropertyChanged<TSender, any>[]) {
    if (batch.length <= 1) {
      return batch;
    }

    const seen = <any>{};
    const unique: ReactivePropertyChanged<TSender, any>[] = [];

    for (let i = batch.length - 1; i >= 0; --i) {
      const args = batch[i];
      // TODO: fix this
      const key = <any>args.property;

      if (seen[key] === undefined) {
        unique.push(args);
      }
    }

    return unique;
  }

  public raisePropertyChanging(property: ReactiveProperty<TSender, any>) {
    this._raisePropertyChanging(() => new ReactivePropertyChanged(this.sender, property));
  }

  public raisePropertyChanged(property: ReactiveProperty<TSender, any>) {
    this._raisePropertyChanged(() => new ReactivePropertyChanged(this.sender, property));
  }
}
