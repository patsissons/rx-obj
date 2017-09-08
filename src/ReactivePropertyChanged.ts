import { ReactiveProperty } from './ReactiveProperty';

export class ReactivePropertyChanged<TSender, TValue> {
  constructor(sender: TSender, property: ReactiveProperty<TSender, TValue>) {
    this.state = {
      sender,
      property,
    };
  }

  private state: {
    sender: TSender,
    property: ReactiveProperty<TSender, TValue>
  } = null;

  public get sender() {
    return this.state.sender;
  }

  public get property() {
    return this.state.property;
  }
}
