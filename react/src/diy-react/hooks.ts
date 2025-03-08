import { scheduleRender } from './schedule';

let hookIndex = 0;
const hooks = [];

export function modifyHookIndex(index) {
  hookIndex = index;
}

export function useState(initialValue) {
  const currentIndex = hookIndex;

  if (hooks[currentIndex] === undefined) {
    const mergedInitialValue = typeof initialValue === 'function' ? initialValue() : initialValue;
    hooks[currentIndex] = mergedInitialValue;
  }

  const dispatch = (newData) => {
    const mergedNewData = typeof newData === 'function' ? newData(hooks[currentIndex]) : newData;
    hooks[currentIndex] = mergedNewData;
    scheduleRender();
  };

  return [hooks[hookIndex++], dispatch];
}

export function useReducer(reducer, initialState) {
  let currentIndex = hookIndex++;

  if (hooks[currentIndex] === undefined) {
    hooks[currentIndex] = initialState;
  }

  const dispatch = (action) => {
    const newData = reducer(hooks[currentIndex], action);
    hooks[currentIndex] = newData;

    scheduleRender();
  };

  return [hooks[currentIndex], dispatch];
}

export function useEffect(callback, deps) {
  let currentIndex = hookIndex++;
  const prevDeps = hooks[currentIndex] ? hooks[currentIndex].deps : undefined;
  const depsChanged = !prevDeps || prevDeps.length !== deps.length || prevDeps.some((dep, i) => dep !== deps[i]);

  if (depsChanged) {
    if (typeof hooks[currentIndex]?.cleanup === 'function') {
      hooks[currentIndex].cleanup();
    }

    const cleanup = callback();
    hooks[currentIndex] = { deps, cleanup };
  }
}
