import { Subscriber, Scheduler } from 'rxjs';

export class ReactiveApp {
  public static defaultErrorHandler = Subscriber.create<Error>(err => {
    console.error(err);
  });

  public static mainScheduler = ReactiveApp.createMainScheduler();

  private static createMainScheduler() {
    // TODO: ...
    const isUnitTestRunner = false;

    // NOTE: The queue scheduler is the currentThread scheduler
    // NOTE: The asap scheduler is the default scheduler
    return isUnitTestRunner ? Scheduler.queue : Scheduler.asap;
  }
}
