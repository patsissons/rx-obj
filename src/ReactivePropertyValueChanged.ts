import { ReactiveObject } from './ReactiveObject';

export class ReactivePropertyValueChanged<TSender extends ReactiveObject, TValue> {
  constructor(sender: TSender, value: TValue) {
    this.state = {
      sender,
      value,
    };
  }

  private state: {
    sender: TSender,
    value: TValue,
  } = null;

  public get sender() {
    return this.state.sender;
  }

  public get value() {
    return this.state.value;
  }
}