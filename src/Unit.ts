export class Unit {
  private static _default = new Unit();

  public static get default() {
    return Unit._default;
  }
}
