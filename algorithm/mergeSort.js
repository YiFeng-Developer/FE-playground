function mergeSort(arr) {
  if (arr.length === 1) return arr;

  const middleIndex = Math.floor(arr.length / 2);
  const leftArr = mergeSort(arr.slice(0, middleIndex));
  const rightArr = mergeSort(arr.slice(middleIndex, arr.length));

  let result = [],
    leftIndex = 0,
    rightIndex = 0;
  while (leftIndex < leftArr.length && rightIndex < rightArr.length) {
    if (leftArr[leftIndex] < rightArr[rightIndex]) {
      result.push(leftArr[leftIndex]);
      leftIndex++;
    } else {
      result.push(rightArr[rightIndex]);
      rightIndex++;
    }
  }

  return [...result, ...leftArr.slice(leftIndex), ...rightArr.slice(rightIndex)];
}

console.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));
