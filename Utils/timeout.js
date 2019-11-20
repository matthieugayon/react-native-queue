import sleep from 'promise-sleep';

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
