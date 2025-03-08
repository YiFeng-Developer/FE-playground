import { createRoot } from 'react-dom/client';
import { useState, useEffect, useReducer } from 'react';
import TasksWithDifferentPrioritiesDemo from './TasksWithDifferentPriorities';
// import { useState, useEffect, useReducer, registerRenderFunc } from './diy-react';

const countReducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state - 1;
    default:
      return state;
  }
};

const App = () => {
  const [count1, dispatch1] = useReducer(countReducer, 1);
  const [count2, dispatch2] = useReducer(countReducer, 2);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <div>
        <button
          onClick={() => {
            dispatch1({ type: 'increment' });
          }}
        >
          添加count1
        </button>
        <button
          onClick={() => {
            dispatch1({ type: 'decrement' });
          }}
        >
          添加count1
        </button>
        <span>count1: {count1}</span>
      </div>
      <div>
        <button
          onClick={() => {
            dispatch2({ type: 'increment' });
          }}
        >
          添加count2
        </button>
        <button
          onClick={() => {
            dispatch2({ type: 'decrement' });
          }}
        >
          减少count2
        </button>
        <span>count2: {count2}</span>
      </div>
      <button
        onClick={() => {
          dispatch1({ type: 'increment' });
          dispatch2({ type: 'increment' });
        }}
      >
        批量更新
      </button>
      seconds: {seconds}
    </div>
  );
};

// function FunctionComponent() {
//   const [number, setNumber] = useState('1');
//   useEffect(() => {
//     setNumber((pre) => (pre += '3'));
//   }, []);
//   return (
//     <button
//       onClick={() => {
//         setNumber((pre) => (pre += '2'));
//       }}
//     >
//       {number}
//     </button>
//   );
// }

const root = createRoot(document.getElementById('root'));
root.render(<TasksWithDifferentPrioritiesDemo />);
