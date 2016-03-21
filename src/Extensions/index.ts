'use strict';

import { Observable, Subscription } from 'rxjs';

import { IReactiveObject } from '../Interfaces';
import { IReactiveObjectExtensions } from './IReactiveObject';

// declare module '../Interfaces' {
//   interface IReactiveObject {
//     getChangingObservable<TSender extends IReactiveObject>(This: TSender): IReactivePropertyChangedEventArgs<TSender>;
//     getChangedObservable<TSender extends IReactiveObject>(This: TSender): IReactivePropertyChangedEventArgs<TSender>;
//     getThrownErrorsObservable<TSender extends IReactiveObject>(This: TSender): Observable<Error>;
//     raisePropertyChanging<TSender extends IReactiveObject>(This: TSender, propertyName: string): void;
//     raisePropertyChanged<TSender extends IReactiveObject>(This: TSender, propertyName: string): void;
//     suppressChangeNotifications<TSender extends IReactiveObject>(This: TSender): Subscription;
//     areChangeNotificationsEnabled<TSender extends IReactiveObject>(This: TSender): boolean;
//     delayChangeNotifications<TSender extends IReactiveObject>(This: TSender): Subscription;
//     areChangeNotificationsDelayed<TSender extends IReactiveObject>(This: TSender): boolean;
//   }
// }

// let IReactiveObjectInterface: IReactiveObject;

// IReactiveObjectInterface.getChangingObservable = IReactiveObjectExtensions.getChangingObservable;
// IReactiveObjectInterface.getChangedObservable = IReactiveObjectExtensions.getChangedObservable;
// IReactiveObjectInterface.getThrownErrorsObservable = IReactiveObjectExtensions.getThrownErrorsObservable;
// IReactiveObjectInterface.raisePropertyChanging = IReactiveObjectExtensions.raisePropertyChanging;
// IReactiveObjectInterface.raisePropertyChanged = IReactiveObjectExtensions.raisePropertyChanged;
// IReactiveObjectInterface.suppressChangeNotifications = IReactiveObjectExtensions.suppressChangeNotifications;
// IReactiveObjectInterface.areChangeNotificationsEnabled = IReactiveObjectExtensions.areChangeNotificationsEnabled;
// IReactiveObjectInterface.delayChangeNotifications = IReactiveObjectExtensions.delayChangeNotifications;
// IReactiveObjectInterface.areChangeNotificationsDelayed = IReactiveObjectExtensions.areChangeNotificationsDelayed;
