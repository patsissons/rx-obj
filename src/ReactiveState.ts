import { Observable, Subject, Scheduler } from 'rxjs';
import { IReactiveObject, IReactivePropertyChangedEventArgs } from './Interfaces';
import { ScheduledSubject } from './ScheduledSubject';
import { Unit } from './Unit';

class ReactiveState<TSender extends IReactiveObject> {
  constructor(private sender: TSender) {
  }

  private changeNotificationsSuppressed = 0;
  private changeNotificationsDelayed = 0;
  private changingSubject = new Subject<IReactivePropertyChangedEventArgs<TSender>>();
  private changedSubject = new Subject<IReactivePropertyChangedEventArgs<TSender>>();
  private startDelayNotificationsSubject = new Subject<Unit>();
  private thrownErrorsSubject = new ScheduledSubject<Error>(Scheduler.asap, RxApp.DefaultExceptionHandler);

  private changedObservable = this.changedSubject
    .buffer(Observable.merge(
      this.changedSubject.filter(_ => this.areChangeNotificationsDelayed() === false).map(_ => Unit.default), startDelayNotifications)
    )
    .flatMap(batch => dedup(batch))
    .publish()
    .refCount();

  private changingObservable = this.changingSubject
    .buffer(Observable.merge(
      this.changingSubject.filter(_ => this.areChangeNotificationsDelayed() === false).map(_ => Unit.default), startDelayNotifications)
    )
    .flatMap(batch => dedup(batch))
    .publish()
    .refCount();

  public get changing() {
    return this.changingObservable;
  }

  public get changed() {
    return this.changedObservable;
  }

  public get thrownErrors() {
    return this.thrownErrorsSubject
      .
  }
}
