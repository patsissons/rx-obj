'use strict';

import { expect } from 'chai';

import { ReactiveObject } from '../src/ReactiveObject';

describe('ReactiveObject Tests', () => {
  describe('tmp', () => {
    it('tmp', () => {
      const obj = new ReactiveObject();

      let changing = obj.changing;
      obj.delayChangeNotifications()
    });
  });
});
