import { ReactiveObject } from './ReactiveObject';
import { ReactiveProperty } from './ReactiveProperty';

export class ReactivePropertyChanged<TSender extends ReactiveObject, TValue> {
  constructor(protected _sender: TSender, protected _property: ReactiveProperty<TSender, TValue>) {
  }

  public get sender() {
    return this._sender;
  }

  public get property() {
    return this._property;
  }
}
