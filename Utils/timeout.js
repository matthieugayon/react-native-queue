export class TimeoutException extends Error {};

let timeoutId = null

function resolveAfter(ms, value=undefined) {
  return new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => resolve(value), ms);
  });
}

export function timeout(promise, timeoutInMs) {
  return Promise.race([
    promise,
    resolveAfter(timeoutInMs,
      Promise.reject(new TimeoutException('Operation timed out'))),
  ]).then(res => {
    clearTimeout(timeoutId)
    return res
  })
}