/**
 * Copyright (c) 2015-present, Haltu Oy
 * Released under the MIT license
 * https://github.com/haltu/muuri/blob/master/LICENSE.md
 */

import { ticker, PHASE_READ } from '../ticker';

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. The returned function accepts one argument which, when
 * being `true`, cancels the debounce function immediately. When the debounce
 * function is canceled it cannot be invoked again.
 *
 * @param {Function} fn
 * @param {number} durationMs
 * @returns {Function}
 */
export function debounce(fn: () => void, durationMs: number) {
  let id = Symbol();
  let timer = 0;
  let lastTime = 0;
  let isCanceled = false;
  let tick: ((time: number) => void) | undefined = (time: number) => {
    if (isCanceled) return;

    if (lastTime) timer -= time - lastTime;
    lastTime = time;

    if (timer > 0) {
      if (tick) {
        ticker.once(PHASE_READ, tick, id);
      }
    } else {
      timer = lastTime = 0;
      fn();
    }
  };

  return function debouncedFn(cancel = false) {
    if (isCanceled) return;

    if (durationMs <= 0) {
      if (cancel !== true) fn();
      return;
    }

    if (cancel === true) {
      isCanceled = true;
      timer = lastTime = 0;
      tick = undefined;
      ticker.off(PHASE_READ, id);
      return;
    }

    if (timer <= 0) {
      timer = durationMs;
      tick && tick(0);
    } else {
      timer = durationMs;
    }
  };
}
