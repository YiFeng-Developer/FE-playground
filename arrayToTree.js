// 将数组结构转换为树
// 非递归，两次遍历时间复杂度为O(n)，借助哈希表来存储数据空间复杂度为O(n)
function arrayToTree(arr) {
  const nodeMap = {};
  arr.forEach((node) => {
    // ✅ 创建新对象避免污染原数据
    nodeMap[node.id] = { ...node, children: [] };
  });
  const result = [];
  arr.forEach((node) => {
    const parentNode = nodeMap[node.parentId];
    // ✅ 只处理存在的父节点，需要判断父节点是否为空
    if (node.parentId && parentNode) {
      parentNode.children.push(nodeMap[node.id]);
    } else {
      result.push(nodeMap[node.id]);
    }
  });
  return result;
}

// 递归，时间复杂度为O(n^2)
// function arrayToTree(arr, parentId = null) {
//   const result = [];
//   arr.forEach((node) => {
//     if (node.parentId === parentId) {
//       // ✅ 创建新对象避免污染原数据
//       result.push({
//         ...node,
//         children: arrayToTree(arr, node.id),
//       });
//     }
//   });

//   return result;
// }

// const data = [
//   { id: 2, name: 'B', parentId: 1 },
//   { id: 1, name: 'A', parentId: null },
//   { id: 3, name: 'C', parentId: 2 },
//   { id: 4, name: 'D', parentId: null },
// ];
// console.log(arrayToTree(data));

const data = [
  { id: 2, name: 'B', parentId: 1 },
  { id: 1, name: 'A', parentId: null },
  { id: 3, name: 'C', parentId: 2 },
  { id: 4, name: 'D', parentId: 5 }, // parentId 5 不存在
  { id: 5, name: 'E', parentId: 4 }, // 循环引用
];

console.log(arrayToTree(data));
