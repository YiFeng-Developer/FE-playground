import { PluginObj } from '@babel/core';
import * as t from '@babel/types';

// 插件入口
const pluginObj: PluginObj = {
  name: 'babel-jsx-plugin',
  visitor: {
    JSXElement(path) {
      const callExpression = transformJSX(path.node);
      path.replaceWith(callExpression);
    },
    JSXFragment(path) {
      const fragment = t.memberExpression(t.identifier('React'), t.identifier('Fragment'));
      const children = processChildren(path.node.children);
      const callExpression = t.callExpression(t.memberExpression(t.identifier('React'), t.identifier('createElement')), [
        fragment,
        t.nullLiteral(),
        ...children,
      ]);
      path.replaceWith(callExpression);
    },
  },
};

// 转换单个 JSX 元素
function transformJSX(jsxElement: t.JSXElement) {
  const openingElement = jsxElement.openingElement;
  const elementType = processElementType(openingElement);

  // 处理子元素 child
  const children = processChildren(jsxElement.children);

  // 处理属性 attrs
  const props = processAttributes(openingElement.attributes);

  // 构建 React.createElement 调用
  const memberExpression = t.memberExpression(t.identifier('React'), t.identifier('createElement'));
  const callExpression = t.callExpression(memberExpression, [elementType, props, ...children]);

  return callExpression;
}

function processElementType(openingElement: t.JSXOpeningElement) {
  if (t.isJSXMemberExpression(openingElement.name)) {
    // 处理类似 <Antd.From /> 之类的 element
    return resolveMemberExpression(openingElement.name);
  } else {
    const elementName = openingElement.name.name as string;
    // 以开头是否是大写字母，区分html元素和组件
    const elementType = /^[A-Z]/.test(elementName) ? t.identifier(elementName) : t.stringLiteral(elementName);

    return elementType;
  }
}

function resolveMemberExpression(ele: t.JSXMemberExpression) {
  // 需要递归处理，可能会有 Antd.Form.Group... 的结构
  const object = t.isJSXMemberExpression(ele.object) ? resolveMemberExpression(ele.object) : t.identifier(ele.object.name);
  const property = t.identifier(ele.property.name);
  return t.memberExpression(object, property);
}

function processAttributes(attributes: t.JSXOpeningElement['attributes']): t.NullLiteral | t.ObjectExpression {
  const props = attributes
    .map((attr) => {
      if (t.isJSXAttribute(attr)) {
        const key = t.identifier((attr.name as t.JSXIdentifier).name);
        let value: t.Expression;
        if (!attr.value) {
          // 处理如 <div disabled />，没有 value，属性值设为 true
          value = t.booleanLiteral(true);
        } else if (t.isStringLiteral(attr.value)) {
          // 处理正常字符串 <div className="cls">
          value = attr.value;
        } else if (t.isJSXExpressionContainer(attr.value)) {
          // 处理表达式 <div onClick={() =>{}}>
          value = attr.value.expression as t.Expression;
        }

        return t.objectProperty(key, value);
      } else if (t.isJSXSpreadAttribute(attr)) {
        // 处理扩展符 <div {...props} />
        return t.spreadElement(attr.argument);
      }
    })
    .filter(Boolean);

  return props.length > 0 ? t.objectExpression(props) : t.nullLiteral();
}

// 处理子节点：文本、元素、表达式
function processChildren(children: t.JSXElement['children']) {
  return children
    .map((child) => {
      // 处理文本
      if (t.isJSXText(child)) {
        const text = child.value.trim();
        return text ? t.stringLiteral(text) : null;
      }
      if (t.isJSXElement(child)) {
        return transformJSX(child); // 递归处理嵌套 JSX
      }

      if (t.isJSXExpressionContainer(child)) {
        return child.expression; // 直接返回表达式
      }
    })
    .filter(Boolean) as t.Expression[];
}

export default function () {
  return pluginObj;
}
