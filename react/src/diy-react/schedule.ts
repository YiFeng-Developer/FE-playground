import { modifyHookIndex } from './hooks';

let isScheduled = false; // 标记是否已安排渲染
let isBatching = false; // 标记是否处于批量更新（如事件回调中）

export function scheduleRender() {
  if (!isScheduled) {
    isScheduled = true;
    // 用微任务模拟 React 的批量更新(类似 React18 的自动批处理)
    Promise.resolve().then(() => {
      isScheduled = false;
      reRender();
    });
  }
}

// 模拟 React 事件批处理
export function batchedUpdates(callback) {
  isBatching = true;
  callback();
  isBatching = false;
  scheduleRender();
}

let stagedRenderFunc = () => {};
export function reRender() {
  modifyHookIndex(0);

  stagedRenderFunc();
}

export function registerRenderFunc(renderFunc: () => void) {
  stagedRenderFunc = renderFunc;
}
