import { IReactiveObject, IReactiveState, IReactivePropertyChangedEventArgs } from '../Interfaces';
import { ReactiveState } from '../ReactiveState';
import { SubscriptionMap } from '../SubscriptionMap';

export class IReactiveObjectExtensions {
  private static ErrorMessages = {
    UndefinedPropertyName: 'Property name is not defined',
  };

  private static state = new SubscriptionMap<IReactiveObject, IReactiveState<IReactiveObject>>(x => x.toString());

  private static GetStateValue<TSender extends IReactiveObject>(This: TSender) {
    return IReactiveObjectExtensions.state
      .GetValue(This, key => <IReactiveState<IReactiveObject>>new ReactiveState<TSender>(This));
  }

  public static getChangingObservable<TSender extends IReactiveObject>(This: TSender) {
    const rxState = IReactiveObjectExtensions.GetStateValue(This);

    return <IReactivePropertyChangedEventArgs<TSender>><any>rxState.changing;
  }

  public static getChangedObservable<TSender extends IReactiveObject>(This: TSender) {
    const rxState = IReactiveObjectExtensions.GetStateValue(This);

    return <IReactivePropertyChangedEventArgs<TSender>><any>rxState.changed;
  }

  public static getThrownErrorsObservable<TSender extends IReactiveObject>(This: TSender) {
    const rxState = IReactiveObjectExtensions.GetStateValue(This);

    return rxState.thrownErrors;
  }

  public static raisePropertyChanging<TSender extends IReactiveObject>(This: TSender, propertyName: string) {
    if (propertyName == undefined) {
      throw new Error(IReactiveObjectExtensions.ErrorMessages.UndefinedPropertyName);
    }

    const rxState = IReactiveObjectExtensions.GetStateValue(This);

    rxState.raisePropertyChanging(propertyName);
  }

  public static raisePropertyChanged<TSender extends IReactiveObject>(This: TSender, propertyName: string) {
    if (propertyName == undefined) {
      throw new Error(IReactiveObjectExtensions.ErrorMessages.UndefinedPropertyName);
    }

    const rxState = IReactiveObjectExtensions.GetStateValue(This);

    rxState.raisePropertyChanged(propertyName);
  }

  public static suppressChangeNotifications<TSender extends IReactiveObject>(This: TSender) {
    const rxState = IReactiveObjectExtensions.GetStateValue(This);

    return rxState.suppressChangeNotifications();
  }

  public static areChangeNotificationsEnabled<TSender extends IReactiveObject>(This: TSender) {
    const rxState = IReactiveObjectExtensions.GetStateValue(This);

    return rxState.areChangeNotificationsEnabled();
  }

  public static delayChangeNotifications<TSender extends IReactiveObject>(This: TSender) {
    const rxState = IReactiveObjectExtensions.GetStateValue(This);

    return rxState.delayChangeNotifications();
  }

  public static areChangeNotificationsDelayed<TSender extends IReactiveObject>(This: TSender) {
    const rxState = IReactiveObjectExtensions.GetStateValue(This);

    return rxState.areChangeNotificationsDelayed();
  }

  // public static raiseAndSetIfChanged<TObj, TRet>(This: TObj, ) {
  // }
}


