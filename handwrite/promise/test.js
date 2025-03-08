import MyPromise from './index.js';

// 链式调用传递值
// new MyPromise((resolve) => {
//   console.log('resolve 初始 x = 1');
//   resolve(1);
// })
//   .then((x) => {
//     console.log(`第一个 then，x + 1 = ${x + 1}`);
//     return x + 1;
//   })
//   .then((x) => {
//     console.log('第二个 then，延时 1 秒');
//     return new MyPromise((resolve) =>
//       setTimeout(() => {
//         console.log(`延时结束，x * 2 = ${x * 2}`);
//         resolve(x * 2);
//       }, 1000),
//     );
//   })
//   .then((x) => {
//     console.log('链式调用完毕 x 最终值:', x);
//   });

// 使用静态方法 all
// const promise1 = new MyPromise((resolve) => setTimeout(() => resolve(1), 300));
// const promise2 = new MyPromise((resolve) => setTimeout(() => resolve(2), 500));
// MyPromise.all([promise1, promise2]).then((values) => {
//   console.log(values); // 输出: [1, 2]
// });

// // 使用静态方法 race
// const promise4 = new MyPromise((resolve) => {
//   setTimeout(() => {
//     resolve('Promise 4');
//   }, 2000);
// });
// const promise5 = new MyPromise((resolve) => {
//   setTimeout(() => {
//     resolve('Promise 5');
//   }, 1000);
// });
// MyPromise.race([promise4, promise5]).then((value) => {
//   console.log(value); // 输出: Promise 5
// });

const promise1 = new Promise((resolve) => {
  setTimeout(() => {
    console.log('setTimeout >>> ');
    resolve(1);
  }, 1000);
}).then((res) => {
  console.log('promise 1 then >>> ');
  return res * 2;
});

Promise.race([promise1, 222]).then((res) => {
  console.log('race >>> ', res);
});
