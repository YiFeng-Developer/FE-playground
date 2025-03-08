// 定义三种状态常量
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    this.status = PENDING; // 初始化状态为 pending
    this.value = undefined; // 初始化成功值
    this.reason = undefined; // 初始化失败原因
    this.onFulfilledCallbacks = []; // 存储成功回调队列
    this.onRejectedCallbacks = []; // 存储失败回调队列

    const resolve = (val) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = val;

        this.onFulfilledCallbacks.forEach((fn) => fn());
      }
    };

    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;

        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  static resolve(value) {
    // 检查 value 是否是 MyPromise 实例，是的话直接返回此实例
    if (value instanceof MyPromise) {
      return value;
    }

    // 不是的话，创建新 MyPromise 实例返回
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    // 创建新 MyPromise 实例 返回
    return new MyPromise((_, reject) => reject(reason));
  }

  static all(promises) {
    const result = new Array(promises.length);
    let completedCount = 0;

    return new MyPromise((resolve, reject) => {
      if (promises.length === 0) {
        return resolve([]);
      }
      promises.forEach((promise, i) => {
        MyPromise.resolve(promise).then((value) => {
          completedCount++;
          result[i] = value;

          if (completedCount === promises.length) {
            resolve(result);
          }
        }, reject);
      });
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (promises.length === 0) {
        return;
      }
      promises.forEach((promise) => {
        MyPromise.resolve(promise).then(
          (value) => resolve(value),
          (reason) => reject(reason),
        );
      });
    });
  }

  then(onFulfilled, onRejected) {
    // 1. 检查处理入参
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason;
          };

    // 2. 返回新的 Promise 实例
    return new MyPromise((resolve, reject) => {
      const handleFulfilled = () => {
        queueMicrotask(() => {
          try {
            // 调用 onFulfilled，获得返回值
            const result = onFulfilled(this.value);
            // 如果是 MyPromise 实例，则等待其状态确定后将结果传递给新的 Promise 的 resolve/reject
            if (result instanceof MyPromise) {
              result.then(resolve, reject);
            } else {
              // 直接传递给 resolve 方法
              resolve(result);
            }
          } catch (err) {
            reject(err);
          }
        });
      };

      const handleRejected = () => {
        queueMicrotask(() => {
          try {
            // 调用 onRejected，获得返回值
            const result = onRejected(this.reason);
            // 如果是 MyPromise 实例，则等待其状态确定后将结果传递给新的 Promise 的 resolve/reject
            if (result instanceof MyPromise) {
              result.then(resolve, reject);
            } else {
              // 直接传递给 resolve 方法
              resolve(result);
            }
          } catch (err) {
            reject(err);
          }
        });
      };
      // 2.1 根据不同的状态进行不同处理
      if (this.status === FULFILLED) {
        // 当前 Promise 是 fulfilled 时，异步执行成功回调函数
        handleFulfilled();
      } else if (this.status === REJECTED) {
        // 当前 Promise 是 rejected 时，异步执行失败回调函数
        handleRejected();
      } else {
        // 当前 Promise 还是 pending 时，将成功和失败回调函数存起来，等待 Promise 状态更改时执行
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    return this.then(
      (value) => MyPromise.resolve(onFinally()).then(() => value),
      (reason) =>
        MyPromise.resolve(onFinally()).then(() => {
          throw reason;
        }),
    );
  }
}

export default MyPromise;
