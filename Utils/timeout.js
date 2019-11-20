const cachedSetTimeout = setTimeout;

function createSleepPromise(timeout, { useCachedSetTimeout }) {
    const timeoutFunction = useCachedSetTimeout ? cachedSetTimeout : setTimeout;

    return new Promise((resolve) => {
        timeoutFunction(resolve, timeout);
    });
}

function sleep(timeout, { useCachedSetTimeout } = {}) {
    const sleepPromise = createSleepPromise(timeout, { useCachedSetTimeout });

    // Pass value through, if used in a promise chain
    function promiseFunction(value) {
        return sleepPromise.then(() => value);
    }

    // Normal promise
    promiseFunction.then = (...args) => sleepPromise.then(...args);
    promiseFunction.catch = Promise.resolve().catch;

    return promiseFunction;
}

export class TimeoutException extends Error {};

export default async function (promise, ms = 10000) {
  const failure = {};
  const result = await Promise.race([
    promise,
    sleep(ms).then(() => failure)
  ]);
  if (result === failure) {
    throw new TimeoutException(`operation timed out after ${ms} milliseconds`);
  } else {
    return result;
  }
}