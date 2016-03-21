'use strict';

import { Observable, Subscription } from 'rxjs';
import { Scheduler } from 'rxjs/Scheduler';

export interface IReactivePropertyChangedEventArgs<T> {
  propertyName: string;
  sender: T;
}

export interface ISubscription {
  isUnsubscribed: boolean;
  unsubscribe(): void;
  add(subscription: Subscription | Function | void): void;
  remove(subscription: Subscription): void;
}

export interface IReactiveObject extends ISubscription {
};

export interface IReactiveState<T extends IReactiveObject> {
  changing: Observable<IReactivePropertyChangedEventArgs<IReactiveObject>>;
  changed: Observable<IReactivePropertyChangedEventArgs<IReactiveObject>>;

  raisePropertyChanging(propertyName: string): void;
  raisePropertyChanged(propertyName: string): void;

  thrownErrors: Observable<Error>;

  areChangeNotificationsEnabled(): boolean;
  suppressChangeNotifications(): Subscription;
  areChangeNotificationsDelayed(): boolean;
  delayChangeNotifications(): Subscription;
}

export interface IReactiveProperty<T> {
  // changing: Observable<T>;
  // changed: Observable<T>;
  // value: T;
};

export interface IReactiveOutputProperty<T> extends IReactiveProperty<T> {
  // source: Observable<T>;
  // thrownErrors: Observable<any>;

  // connect(): Subscription;
  // catchErrors(errorHandler: (error: any) => void): IReactiveOutputProperty<T>;
  // unsubscribe(): void;
};

export interface IReactiveCommand<T> {
};

// export interface IReactiveList<T> {
// };
