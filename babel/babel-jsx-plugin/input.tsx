import React from 'react';
// @ts-ignore
import Antd from 'Antd';

const props = { a: '111' };

function Button() {
  return <div {...props}>按钮</div>;
}

function App() {
  const count = 1;

  return (
    <>
      <Antd.From.Group />
      <div className="header" onClick={() => {}}>
        Hello <span>World</span>
        {count}
        <Button />
      </div>
    </>
  );
}

export default App;
