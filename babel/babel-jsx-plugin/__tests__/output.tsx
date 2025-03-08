import React from 'react';
// @ts-ignore
import Antd from 'Antd';
const props = {
  a: '111'
};
function Button() {
  return React.createElement("div", {
    ...props
  }, "\u6309\u94AE");
}
function App() {
  const count = 1;
  return React.createElement(React.Fragment, null, React.createElement(Antd.From.Group, null), React.createElement("div", {
    className: "header",
    onClick: () => {}
  }, "Hello", React.createElement("span", null, "World"), count, React.createElement(Button, null)));
}
export default App;
