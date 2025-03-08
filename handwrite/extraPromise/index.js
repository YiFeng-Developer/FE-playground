function injectCancel() {
  let cancelExecutor = () => {},
    isCanceled = false;
  const cancelPromise = new Promise((_, reject) => {
    cancelExecutor = () => {
      if (isCanceled) return;
      isCanceled = true;

      reject(new Error('Promise is canceled!'));
    };
  });

  const mountProperty = (self) => {
    self.cancel = cancelExecutor;
    self.isCanceled = isCanceled;
  };

  return {
    promise: cancelPromise,
    mountProperty,
  };
}

function injectTimeout(ms) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      reject(new Error('Promise is timeout'));
    }, ms);
  });

  return {
    promise: timeoutPromise,
  };
}

class ExtraPromise extends Promise {
  constructor(executor, options) {
    const originalPromise = new Promise(executor);

    const { timeout } = options || {};
    const { promise: cancelPromise, mountProperty: mountCancelProperty } = injectCancel();
    const { promise: timeoutPromise } = injectTimeout(timeout);

    const promiseGroup = Promise.race([originalPromise, cancelPromise, timeoutPromise]);

    super((resolve, reject) => {
      promiseGroup.then(resolve, reject);
    });

    mountCancelProperty(this);
  }
}

// =========== 取消 Promise ==================
// const promise1 = new ExtraPromise((resolve) => {
//   setTimeout(() => {
//     resolve('Success');
//   }, 2000);
// });

// setTimeout(() => {
//   promise1.cancel();
// }, 1000);

// promise1
//   .then((res) => {
//     console.log('请求结果：', res);
//   })
//   .catch((err) => {
//     console.log('err >>> ', err.message);
//   });

// ============= Promise 超时取消 ========================
const extraOptions = { timeout: 1000 };
const promise2 = new ExtraPromise((resolve) => {
  setTimeout(() => {
    resolve('Success');
  }, 2000);
}, extraOptions);

promise2
  .then((res) => {
    console.log('请求结果：', res);
  })
  .catch((err) => {
    console.log('err >>> ', err.message);
  });

// ============ 控制并发 ==================

// ============== 重试 =====================
