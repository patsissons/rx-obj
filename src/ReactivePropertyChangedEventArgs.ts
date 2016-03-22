export class ReactivePropertyChangedEventArgs<TSender> {
  constructor(protected _sender: TSender, protected _propertyName: string) {
  }

  public get sender() {
    return this._sender;
  }

  public get propertyName() {
    return this._propertyName;
  }
}
