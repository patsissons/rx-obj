import { ReactiveObject } from './ReactiveObject';

export class ReactivePropertyValueChanged<TSender extends ReactiveObject, TValue> {
  constructor(protected _sender: TSender, protected _value: TValue) {
  }

  public get sender() {
    return this._sender;
  }

  public get value() {
    return this._value;
  }
}
