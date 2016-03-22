import { Observable, Subject, Scheduler, Subscription } from 'rxjs';

import { ReactiveApp } from './ReactiveApp';
import { ReactiveObject } from './ReactiveObject';
import { ReactivePropertyChangedEventArgs } from './ReactivePropertyChangedEventArgs';
import { ScheduledSubject } from './ScheduledSubject';
import { Unit } from './Unit';

function dedup<TSender>(batch: ReactivePropertyChangedEventArgs<TSender>[]) {
  if (batch.length <= 1) {
    return batch;
  }

  const seen = <any>{};
  const unique: ReactivePropertyChangedEventArgs<TSender>[] = [];

  for (let i = batch.length - 1; i >= 0; --i) {
    const args = batch[i];
    if (seen[args.propertyName] === undefined) {
      unique.push(args);
    }
  }

  return unique;
}

export class ReactiveState<TSender extends ReactiveObject> {
  constructor(private sender: TSender) {
  }

  private changeNotificationsSuppressed = 0;
  private changeNotificationsDelayed = 0;
  private changingSubject = new Subject<ReactivePropertyChangedEventArgs<TSender>>();
  private changedSubject = new Subject<ReactivePropertyChangedEventArgs<TSender>>();
  private startDelayNotificationsSubject = new Subject<Unit>();
  // NOTE: The undefined scheduler is equivalent to the immediate scheduler
  private thrownErrorsSubject = new ScheduledSubject<Error>(undefined, ReactiveApp.DefaultErrorHandler);

  // NOTE: currently RxJS's mergeMap (aka selectMany) typings does not support
  //       a projection as an array. A new ObservableInput type is coming but
  //       not yet published to npm.

  private changedObservable = this.changedSubject
    .buffer(Observable.merge(
      this.changedSubject
        .filter(_ => this.areChangeNotificationsDelayed() === false)
        .map(_ => Unit.Default), this.startDelayNotificationsSubject)
    )
    .mergeMap(batch => <any>dedup(batch))
    .publish()
    .refCount();

  private changingObservable = this.changingSubject
    .buffer(Observable.merge(
      this.changingSubject
        .filter(_ => this.areChangeNotificationsDelayed() === false)
        .map(_ => Unit.Default), this.startDelayNotificationsSubject)
    )
    .mergeMap(batch => <any>dedup(batch))
    .publish()
    .refCount();

  get changing() {
    return this.changingObservable;
  }

  get changed() {
    return this.changedObservable;
  }

  get thrownErrors() {
    return this.thrownErrorsSubject
      .asObservable();
  }

  areChangeNotificationsEnabled() {
    return this.changeNotificationsSuppressed === 0;
  }

  areChangeNotificationsDelayed() {
    return this.changeNotificationsDelayed > 0;
  }

  suppressChangeNotifications() {
    ++this.changeNotificationsSuppressed;

    return new Subscription(() => {
      --this.changeNotificationsSuppressed;
    });
  }

  delayChangeNotifications() {
    ++this.changeNotificationsDelayed;

    if (this.changeNotificationsDelayed === 1) {
      this.startDelayNotificationsSubject.next(Unit.Default);
    }

    return new Subscription(() => {
      --this.changeNotificationsDelayed;

      if (this.changeNotificationsDelayed === 0) {
        this.startDelayNotificationsSubject.next(Unit.Default);
      }
    });
  }

  raisePropertyChanging(propertyName: string) {
    if (this.areChangeNotificationsEnabled() === false) {
      return;
    }

    const changing = new ReactivePropertyChangedEventArgs(this.sender, propertyName);

    this.notifyObservable(this.sender, changing, this.changingSubject);
  }

  raisePropertyChanged(propertyName: string) {
    if (this.areChangeNotificationsEnabled() === false) {
      return;
    }

    const changed  = new ReactivePropertyChangedEventArgs(this.sender, propertyName);

    this.notifyObservable(this.sender, changed, this.changedSubject);
  }

  public notifyObservable(obj: TSender, args: ReactivePropertyChangedEventArgs<TSender>, subject: Subject<ReactivePropertyChangedEventArgs<TSender>>) {
    try {
      subject.next(args);
    } catch (err) {
      this.thrownErrorsSubject.next(err);
    }
  }
}
