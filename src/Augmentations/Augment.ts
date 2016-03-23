export function augment<T extends Function>(implementation: T, thisArg: any = this) {
  return function() {
    const args = <any[]>Array.prototype.slice.call(arguments);

    args.unshift(this);

    return implementation.apply(thisArg, args);
  };
}
