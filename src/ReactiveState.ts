import { Observable, Subject, Subscription } from 'rxjs';
import { Scheduler } from 'rxjs/Scheduler';

import { ReactiveApp } from './ReactiveApp';
import { ReactiveObject } from './ReactiveObject';
import { ReactivePropertyChanged } from './ReactivePropertyChanged';
import { ScheduledSubject } from './ScheduledSubject';
import { Unit } from './Unit';

export abstract class ReactiveState<TSender extends ReactiveObject, TChange> extends Subscription {
  constructor(protected sender: TSender, errorScheduler?: Scheduler) {
    super();

    this.thrownErrorsSubject = new ScheduledSubject(errorScheduler, ReactiveApp.DefaultErrorHandler);

    this.changingObservable = this.createChangingObservable()
      .publish()
      .refCount();
    this.changedObservable = this.createChangedObservable()
      .publish()
      .refCount();

    this.add(this.startDelayNotificationsSubject);
    this.add(this.changingSubject);
    this.add(this.changedSubject);
    this.add(this.thrownErrorsSubject);
  }

  private changeNotificationsSuppressed = 0;
  private changeNotificationsDelayed = 0;
  private startDelayNotificationsSubject = new Subject<Unit>();

  protected changingSubject = new Subject<TChange>();
  protected changedSubject = new Subject<TChange>();

  protected thrownErrorsSubject: ScheduledSubject<Error>;
  protected changingObservable: Observable<TChange>;
  protected changedObservable: Observable<TChange>;

  protected dedup(batch: TChange[]) {
    return batch;
  }

  // NOTE: currently RxJS's mergeMap (aka selectMany) typings does not support
  //       a projection as an array. A new ObservableInput type is coming but
  //       not yet published to npm.

  protected createChangingObservable() {
    return this.changingSubject
      .buffer(Observable.merge(
        this.changingSubject
          .filter(_ => this.areChangeNotificationsDelayed() === false)
          .map(_ => Unit.Default), this.startDelayNotificationsSubject)
      )
      .mergeMap<TChange>(x => <any>this.dedup(x));
  }

  protected createChangedObservable() {
    return this.changedSubject
      .buffer(Observable.merge(
        this.changedSubject
          .filter(_ => this.areChangeNotificationsDelayed() === false)
          .map(_ => Unit.Default), this.startDelayNotificationsSubject)
      )
      .mergeMap<TChange>(x => <any>this.dedup(x));
  }

  public get changing() {
    return this.changingObservable;
  }

  public get changed() {
    return this.changedObservable;
  }

  public get thrownErrors() {
    return this.thrownErrorsSubject
      .asObservable();
  }

  public areChangeNotificationsEnabled() {
    return this.changeNotificationsSuppressed === 0;
  }

  public areChangeNotificationsDelayed() {
    return this.changeNotificationsDelayed > 0;
  }

  public suppressChangeNotifications() {
    ++this.changeNotificationsSuppressed;

    return new Subscription(() => {
      --this.changeNotificationsSuppressed;
    });
  }

  public delayChangeNotifications() {
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

  protected _raisePropertyChanging(changing: () => TChange) {
    if (this.areChangeNotificationsEnabled() === false) {
      return;
    }

    this.notifyObservable(this.sender, changing(), this.changingSubject);
  }

  protected _raisePropertyChanged(changed: () => TChange) {
    if (this.areChangeNotificationsEnabled() === false) {
      return;
    }

    this.notifyObservable(this.sender, changed(), this.changedSubject);
  }

  public notifyObservable(obj: TSender, change: TChange, subject: Subject<TChange>) {
    try {
      subject.next(change);
    } catch (err) {
      this.thrownErrorsSubject.next(err);
    }
  }
}
