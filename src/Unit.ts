export class Unit {
  private static defaultInstance = new Unit();

  public static get default() {
    return Unit.defaultInstance;
  }
}
