// ============= 取消 ==================
function withCancel(promise) {
  let isCanceled = false,
    cancelExecutor = () => {};

  const cancelPromise = new Promise((_, reject) => {
    cancelExecutor = () => {
      if (isCanceled) return;
      isCanceled = true;

      reject(new Error('Promise is canceled!'));
    };
  });

  return {
    promise: Promise.race([promise, cancelPromise]),
    cancel: cancelExecutor,
  };
}

const promise1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(1);
  }, 2000);
});

const promiseWithCancel = withCancel(promise1);

setTimeout(() => {
  promiseWithCancel.cancel();
}, 1000);

promiseWithCancel.promise
  .then((res) => {
    console.log('result :', res);
  })
  .catch((err) => {
    console.log('error : ', err.message);
  });

// ========== 超时控制 =============
// function withTimeout(originalPromise, ms) {
//   if (ms === undefined) return originalPromise;

//   const timeoutPromise = new Promise((_, reject) => {
//     setTimeout(() => {
//       reject(new Error('Promise is timeout!'));
//     }, ms);
//   });

//   return Promise.race([originalPromise, timeoutPromise]);
// }

// const promise1 = new Promise((resolve) => {
//   setTimeout(() => {
//     resolve(1);
//   }, 2000);
// });

// const withTimeoutPromise1 = withTimeout(promise1, 1000);

// withTimeoutPromise1
//   .then((res) => {
//     console.log('请求成功', res);
//   })
//   .catch((err) => {
//     console.log('err >>> ', err.message);
//   });

// ======= 并发控制 ==========
// function promisePool(promises, limit) {
//   let currentIndex = 0,
//     activeCount = 0;
//   const results = [];
//   return new Promise((resolve) => {
//     function runNext() {
//       // 如果所有任务已经安排完毕，并且没有活动任务，则返回最终结果
//       if (currentIndex >= promises.length && activeCount === 0) {
//         return resolve(results);
//       }

//       // 当活动任务数未达到上限，且还有任务未执行时
//       while (activeCount < limit && currentIndex < promises.length) {
//         const promise = promises[currentIndex++];
//         activeCount++;

//         // 执行任务
//         promise()
//           .then((result) => {
//             results.push(result);
//           })
//           .catch((err) => {
//             results.push(err);
//           })
//           .finally(() => {
//             activeCount--;
//             runNext(); // 完成一个任务后，启动下一个任务
//           });
//       }
//     }

//     runNext();
//   });
// }

// function asyncTask(id) {
//   return new Promise((resolve) => {
//     console.log(`Task ${id} request`);
//     setTimeout(() => {
//       console.log(`Task ${id} completed`);
//       resolve(id);
//     }, Math.random() * 3000);
//   });
// }

// const tasks = Array.from({ length: 10 }, (_, i) => () => asyncTask(i));
// promisePool(tasks, 3).then((results) => {
//   console.log('All tasks completed: ', results);
// });

// ======== 重试 ==========
// function withRetry(promise, maxRetries, delay) {
//   return new Promise((resolve, reject) => {
//     promise.then(resolve, (err) => {
//       if (maxRetries <= 0) {
//         reject(err);
//       } else {
//         console.log(`请求失败，${delay}ms 后重试`);
//         setTimeout(() => {
//           withRetry(promise, maxRetries - 1, delay).then(resolve, reject);
//         }, delay);
//       }
//     });
//   });
// }

// const asyncPromise1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     const random = Math.random();
//     if (random > 0.5) {
//       resolve('Success');
//     } else {
//       reject(new Error('Operation failed'));
//     }
//   }, 1000);
// });

// const asyncPromiseWithRetry = withRetry(asyncPromise1, 3, 1000);
// asyncPromiseWithRetry
//   .then((res) => {
//     console.log('result: ', res);
//   })
//   .catch((error) => {
//     console.log('fail: ', error.message);
//   });
