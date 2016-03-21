'use strict';

import './Extensions';

import { Observable, Subject, BehaviorSubject, Subscription } from 'rxjs';
import { Scheduler } from 'rxjs/Scheduler';

import { IReactiveObject, IReactiveProperty, IReactiveCommand, IReactivePropertyChangedEventArgs } from './Interfaces';
// import { ReactiveProperty } from './ReactiveProperty';

export class ReactiveObject extends Subscription implements IReactiveObject {
  // get changing() {
  //   return this.changingSubject
  //     .asObservable();
  // }

  // get changed() {
  //   return this.changedSubject
  //     .asObservable();
  // }

  // get thrownErrors() {
  //   return this.thrownErrorsSubject
  //     .asObservable();
  // }

  // delayChangeNotifications() {
  //   this.notificationsDelayedSubject.next(this.notificationsDelayedSubject.value + 1);

  //   return new Subscription(() => {
  //     this.notificationsDelayedSubject.next(this.notificationsDelayedSubject.value - 1);
  //   });
  // }

  // areChangeNotificationsEnabled() {
  //   return this.notificationsDelayedSubject.value === 0;
  // }

  // areChangeNotificationsDelayed() {
  //   return this.notificationsDelayedSubject.value > 0;
  // }

  // property<T>(initialValue?: T, scheduler?: Scheduler): IReactiveProperty<T> {
  //   let prop = new ReactiveProperty(initialValue, scheduler);

  //   return prop;
  // }

  // command<TRet, TParam>(execute: (x: TParam) => Observable<TRet>, canExecute: Observable<boolean>): IReactiveCommand<TRet> {
  //   let cmd: IReactiveCommand<TRet> = null;

  //   return cmd;
  // }
};

export default ReactiveObject;
