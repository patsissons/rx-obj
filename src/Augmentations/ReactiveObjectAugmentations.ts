import { Observable, Subscription } from 'rxjs';

import { ReactivePropertyChangedEventArgs } from '../ReactivePropertyChangedEventArgs';
import { ReactiveObject } from '../ReactiveObject';

import { ReactiveState } from '../ReactiveState';
import { SubscriptionMap } from '../SubscriptionMap';

export class ReactiveObjectAugmentations {
  private static ErrorMessages = {
    UndefinedPropertyName: 'Property name is not defined',
  };

  private static state = new SubscriptionMap<ReactiveObject, ReactiveState<ReactiveObject>>(x => x.toString());

  private static getStateValue<TSender extends ReactiveObject>(This: TSender) {
    return ReactiveObjectAugmentations.state
      .GetValue(This, key => <ReactiveState<ReactiveObject>>new ReactiveState<TSender>(This));
  }

  public static getChangingObservable<TSender extends ReactiveObject>(This: TSender) {
    const rxState = ReactiveObjectAugmentations.getStateValue(This);

    return <ReactivePropertyChangedEventArgs<TSender>><any>rxState.changing;
  }

  public static getChangedObservable<TSender extends ReactiveObject>(This: TSender) {
    const rxState = ReactiveObjectAugmentations.getStateValue(This);

    return <ReactivePropertyChangedEventArgs<TSender>><any>rxState.changed;
  }

  public static getThrownErrorsObservable<TSender extends ReactiveObject>(This: TSender) {
    const rxState = ReactiveObjectAugmentations.getStateValue(This);

    return rxState.thrownErrors;
  }

  public static raisePropertyChanging<TSender extends ReactiveObject>(This: TSender, propertyName: string) {
    if (propertyName == undefined) {
      throw new Error(ReactiveObjectAugmentations.ErrorMessages.UndefinedPropertyName);
    }

    const rxState = ReactiveObjectAugmentations.getStateValue(This);

    rxState.raisePropertyChanging(propertyName);
  }

  public static raisePropertyChanged<TSender extends ReactiveObject>(This: TSender, propertyName: string) {
    if (propertyName == undefined) {
      throw new Error(ReactiveObjectAugmentations.ErrorMessages.UndefinedPropertyName);
    }

    const rxState = ReactiveObjectAugmentations.getStateValue(This);

    rxState.raisePropertyChanged(propertyName);
  }

  public static suppressChangeNotifications<TSender extends ReactiveObject>(This: TSender) {
    const rxState = ReactiveObjectAugmentations.getStateValue(This);

    return rxState.suppressChangeNotifications();
  }

  public static areChangeNotificationsEnabled<TSender extends ReactiveObject>(This: TSender) {
    const rxState = ReactiveObjectAugmentations.getStateValue(This);

    return rxState.areChangeNotificationsEnabled();
  }

  public static delayChangeNotifications<TSender extends ReactiveObject>(This: TSender) {
    const rxState = ReactiveObjectAugmentations.getStateValue(This);

    return rxState.delayChangeNotifications();
  }

  public static areChangeNotificationsDelayed<TSender extends ReactiveObject>(This: TSender) {
    const rxState = ReactiveObjectAugmentations.getStateValue(This);

    return rxState.areChangeNotificationsDelayed();
  }
}

declare module '../ReactiveObject' {
  interface ReactiveObject {
    getChangingObservable<TSender extends ReactiveObject>(): ReactivePropertyChangedEventArgs<TSender>;
    getChangedObservable<TSender extends ReactiveObject>(): ReactivePropertyChangedEventArgs<TSender>;
    getThrownErrorsObservable<TSender extends ReactiveObject>(): Observable<Error>;
    raisePropertyChanging<TSender extends ReactiveObject>(propertyName: string): void;
    raisePropertyChanged<TSender extends ReactiveObject>(propertyName: string): void;
    suppressChangeNotifications<TSender extends ReactiveObject>(): Subscription;
    areChangeNotificationsEnabled<TSender extends ReactiveObject>(): boolean;
    delayChangeNotifications<TSender extends ReactiveObject>(): Subscription;
    areChangeNotificationsDelayed<TSender extends ReactiveObject>(): boolean;
  }
}

ReactiveObject.prototype.getChangingObservable = function() { return ReactiveObjectAugmentations.getChangingObservable(this); };
ReactiveObject.prototype.getChangedObservable = function() { return ReactiveObjectAugmentations.getChangedObservable(this); };
ReactiveObject.prototype.getThrownErrorsObservable = function() { return ReactiveObjectAugmentations.getThrownErrorsObservable(this); };
ReactiveObject.prototype.raisePropertyChanging = function(propertyName: string) { return ReactiveObjectAugmentations.raisePropertyChanging(this, propertyName); };
ReactiveObject.prototype.raisePropertyChanged = function(propertyName: string) { return ReactiveObjectAugmentations.raisePropertyChanged(this, propertyName); };
ReactiveObject.prototype.suppressChangeNotifications = function() { return ReactiveObjectAugmentations.suppressChangeNotifications(this); };
ReactiveObject.prototype.areChangeNotificationsEnabled = function() { return ReactiveObjectAugmentations.areChangeNotificationsEnabled(this); };
ReactiveObject.prototype.delayChangeNotifications = function() { return ReactiveObjectAugmentations.delayChangeNotifications(this); };
ReactiveObject.prototype.areChangeNotificationsDelayed = function() { return ReactiveObjectAugmentations.areChangeNotificationsDelayed(this); };
