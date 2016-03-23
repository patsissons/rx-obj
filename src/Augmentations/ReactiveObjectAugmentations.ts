import { Observable, Subscription } from 'rxjs';

import { augment } from './Augment';

import { ReactiveObject } from '../ReactiveObject';
import { ReactiveProperty } from '../ReactiveProperty';
import { ReactivePropertyChanged } from '../ReactivePropertyChanged';
import { ReactiveObjectState } from '../ReactiveObjectState';
import { SubscriptionMap } from '../SubscriptionMap';

export class ReactiveObjectAugmentations {
  private static ErrorMessages = {
    UndefinedProperty: 'Property is not defined',
  };

  private static state = new SubscriptionMap<ReactiveObject, ReactiveObjectState<ReactiveObject>>(x => x.toString());

  private static getStateValue<TSender extends ReactiveObject>(This: TSender) {
    return ReactiveObjectAugmentations.state
      .GetValue(This, key => <ReactiveObjectState<ReactiveObject>>new ReactiveObjectState<TSender>(This));
  }

  public static getChangingObservable<TSender extends ReactiveObject>(This: TSender) {
    const rxState = ReactiveObjectAugmentations.getStateValue(This);

    return <ReactivePropertyChanged<TSender, any>><any>rxState.changing;
  }

  public static getChangedObservable<TSender extends ReactiveObject>(This: TSender) {
    const rxState = ReactiveObjectAugmentations.getStateValue(This);

    return <ReactivePropertyChanged<TSender, any>><any>rxState.changed;
  }

  public static getThrownErrorsObservable<TSender extends ReactiveObject>(This: TSender) {
    const rxState = ReactiveObjectAugmentations.getStateValue(This);

    return rxState.thrownErrors;
  }

  public static raisePropertyChanging<TSender extends ReactiveObject>(This: TSender, property: ReactiveProperty<TSender, any>) {
    if (property == undefined) {
      throw new Error(ReactiveObjectAugmentations.ErrorMessages.UndefinedProperty);
    }

    const rxState = ReactiveObjectAugmentations.getStateValue(This);

    rxState.raisePropertyChanging(property);
  }

  public static raisePropertyChanged<TSender extends ReactiveObject>(This: TSender, property: ReactiveProperty<TSender, any>) {
    if (property == undefined) {
      throw new Error(ReactiveObjectAugmentations.ErrorMessages.UndefinedProperty);
    }

    const rxState = ReactiveObjectAugmentations.getStateValue(This);

    rxState.raisePropertyChanged(property);
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
    getChangingObservable<TSender extends ReactiveObject>(): ReactivePropertyChanged<TSender, any>;
    getChangedObservable<TSender extends ReactiveObject>(): ReactivePropertyChanged<TSender, any>;
    getThrownErrorsObservable<TSender extends ReactiveObject>(): Observable<Error>;
    raisePropertyChanging<TSender extends ReactiveObject>(propertyName: string): void;
    raisePropertyChanged<TSender extends ReactiveObject>(propertyName: string): void;
    suppressChangeNotifications<TSender extends ReactiveObject>(): Subscription;
    areChangeNotificationsEnabled<TSender extends ReactiveObject>(): boolean;
    delayChangeNotifications<TSender extends ReactiveObject>(): Subscription;
    areChangeNotificationsDelayed<TSender extends ReactiveObject>(): boolean;
  }
}

ReactiveObject.prototype.getChangingObservable = augment(ReactiveObjectAugmentations.getChangingObservable, this);
ReactiveObject.prototype.getChangedObservable = augment(ReactiveObjectAugmentations.getChangedObservable, this);
ReactiveObject.prototype.getThrownErrorsObservable = augment(ReactiveObjectAugmentations.getThrownErrorsObservable, this);
ReactiveObject.prototype.raisePropertyChanging = augment(ReactiveObjectAugmentations.raisePropertyChanging, this);
ReactiveObject.prototype.raisePropertyChanged = augment(ReactiveObjectAugmentations.raisePropertyChanged, this);
ReactiveObject.prototype.suppressChangeNotifications = augment(ReactiveObjectAugmentations.suppressChangeNotifications, this);
ReactiveObject.prototype.areChangeNotificationsEnabled = augment(ReactiveObjectAugmentations.areChangeNotificationsEnabled, this);
ReactiveObject.prototype.delayChangeNotifications = augment(ReactiveObjectAugmentations.delayChangeNotifications, this);
ReactiveObject.prototype.areChangeNotificationsDelayed = augment(ReactiveObjectAugmentations.areChangeNotificationsDelayed, this);
