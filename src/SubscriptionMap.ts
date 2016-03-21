import { Subscription } from 'rxjs';
import { ISubscription, IReactiveObject } from './Interfaces';

export class SubscriptionMap<TKey extends ISubscription, TValue> {
  private static ErrorMessages = {
    DuplicateKeyError: 'Subscription Key Already Exists',
    MissingKeyError: 'Subscription Key Does Not Exist',
  };

  constructor(private keyFunction: (sub: TKey) => string) {
  }

  private map = <any>{};

  public contains(sub: TKey) {
    return this.containsKey(this.keyFunction(sub));
  }

  public Add(sub: TKey, value: TValue) {
    this.AddKey(this.keyFunction(sub), sub, value);
  }

  public Remove(sub: TKey) {
    this.RemoveKey(this.keyFunction(sub), sub);
  }

  public GetValue(sub: TKey, valueCreator: (sub: TKey) => TValue) {
    return this.getKeyValue(this.keyFunction(sub), sub, valueCreator);
  }

  protected containsKey(key: string) {
    return this.map.hasOwnProperty(key);
  }

  protected AddKey(key: string, sub: TKey, value: TValue) {
    if (this.map.hasOwnProperty(key)) {
      throw new Error(SubscriptionMap.ErrorMessages.DuplicateKeyError);
    }

    const removeSub = new Subscription(() => {
      this.RemoveKey(key, sub);
    });

    sub.add(removeSub);

    this.map[key] = value;
  }

  protected RemoveKey(key: string, sub: TKey) {
    if (this.map.hasOwnProperty(key) === false) {
      throw new Error(SubscriptionMap.ErrorMessages.MissingKeyError);
    }

    // RxJS Subscription.unsubscribe sets isUnsubscribed before calling unsubscribe on child subscriptions
    if (sub.isUnsubscribed) {
      delete this.map[key];
    } else {
      sub.unsubscribe();
    }
  }

  protected getKeyValue(key: string, sub: TKey, valueCreator: (sub: TKey) => TValue) {
    const keyExists = this.containsKey(key);
    const value = keyExists ? <TValue>this.map[key] : valueCreator(sub);

    if (keyExists === false) {
      this.AddKey(key, sub, value);
    }

    return value;
  }
}
