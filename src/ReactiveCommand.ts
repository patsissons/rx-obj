import { Subscription } from 'rxjs';

import { ReactiveObject } from './ReactiveObject';

export class ReactiveCommand<TSender extends ReactiveObject, TParam, TResult> extends Subscription {
}
