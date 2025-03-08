"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
var t = require("@babel/types");
// 插件入口
var pluginObj = {
    name: 'babel-jsx-plugin',
    visitor: {
        JSXElement: function (path) {
            var callExpression = transformJSX(path.node);
            path.replaceWith(callExpression);
        },
        JSXFragment: function (path) {
            var fragment = t.memberExpression(t.identifier('React'), t.identifier('Fragment'));
            var children = processChildren(path.node.children);
            var callExpression = t.callExpression(t.memberExpression(t.identifier('React'), t.identifier('createElement')), __spreadArray([
                fragment,
                t.nullLiteral()
            ], children, true));
            path.replaceWith(callExpression);
        },
    },
};
// 转换单个 JSX 元素
function transformJSX(jsxElement) {
    var openingElement = jsxElement.openingElement;
    var elementType = processElementType(openingElement);
    // 处理子元素 child
    var children = processChildren(jsxElement.children);
    // 处理属性 attrs
    var props = processAttributes(openingElement.attributes);
    // 构建 React.createElement 调用
    var memberExpression = t.memberExpression(t.identifier('React'), t.identifier('createElement'));
    var callExpression = t.callExpression(memberExpression, __spreadArray([elementType, props], children, true));
    return callExpression;
}
function processElementType(openingElement) {
    if (t.isJSXMemberExpression(openingElement.name)) {
        // 处理类似 <Antd.From /> 之类的 element
        return resolveMemberExpression(openingElement.name);
    }
    else {
        var elementName = openingElement.name.name;
        // 以开头是否是大写字母，区分html元素和组件
        var elementType = /^[A-Z]/.test(elementName) ? t.identifier(elementName) : t.stringLiteral(elementName);
        return elementType;
    }
}
function resolveMemberExpression(ele) {
    // 需要递归处理，可能会有 Antd.Form.Group... 的结构
    var object = t.isJSXMemberExpression(ele.object) ? resolveMemberExpression(ele.object) : t.identifier(ele.object.name);
    var property = t.identifier(ele.property.name);
    return t.memberExpression(object, property);
}
function processAttributes(attributes) {
    var props = attributes
        .map(function (attr) {
        if (t.isJSXAttribute(attr)) {
            var key = t.identifier(attr.name.name);
            var value = void 0;
            if (!attr.value) {
                // 处理如 <div disabled />，没有 value，属性值设为 true
                value = t.booleanLiteral(true);
            }
            else if (t.isStringLiteral(attr.value)) {
                // 处理正常字符串 <div className="cls">
                value = attr.value;
            }
            else if (t.isJSXExpressionContainer(attr.value)) {
                // 处理表达式 <div onClick={() =>{}}>
                value = attr.value.expression;
            }
            return t.objectProperty(key, value);
        }
        else if (t.isJSXSpreadAttribute(attr)) {
            // 处理扩展符 <div {...props} />
            return t.spreadElement(attr.argument);
        }
    })
        .filter(Boolean);
    return props.length > 0 ? t.objectExpression(props) : t.nullLiteral();
}
// 处理子节点：文本、元素、表达式
function processChildren(children) {
    return children
        .map(function (child) {
        // 处理文本
        if (t.isJSXText(child)) {
            var text = child.value.trim();
            return text ? t.stringLiteral(text) : null;
        }
        if (t.isJSXElement(child)) {
            return transformJSX(child); // 递归处理嵌套 JSX
        }
        if (t.isJSXExpressionContainer(child)) {
            return child.expression; // 直接返回表达式
        }
    })
        .filter(Boolean);
}
function default_1() {
    return pluginObj;
}
//# sourceMappingURL=jsx-plugin.js.map