import React, { useTransition, useState } from 'react';

function App() {
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState('');
  const [list, setList] = useState([]);

  const handleInputChange = (e) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);

    // 启动一个低优先级的过渡更新
    startTransition(() => {
      // 模拟一个耗时的操作，例如从 API 获取数据
      const randomIndex = Math.floor(Math.random() * 100);
      const newList = Array.from({ length: 100000 }, (_, index) => `Item ${randomIndex + index}`);
      setList(newList);
    });
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Type something..." />
      {isPending && <div>Loading...</div>}
      {isPending ? null : (
        <ul>
          {list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
