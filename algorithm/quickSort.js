// 快速排序
function quickSort(arr) {
  if (arr.length < 2) return arr;
  const tempArr = [...arr];
  const pivotIndex = 0;
  let i = pivotIndex + 1,
    j = tempArr.length - 1;

  while (i <= j) {
    while (i <= j && tempArr[i] < tempArr[pivotIndex]) {
      i++;
    }
    while (i <= j && tempArr[j] > tempArr[pivotIndex]) {
      j--;
    }

    if (i <= j) {
      [tempArr[i], tempArr[j]] = [tempArr[j], tempArr[i]];
      i++;
      j--;
    }
  }
  [tempArr[pivotIndex], tempArr[j]] = [tempArr[j], tempArr[pivotIndex]];
  return [...quickSort(tempArr.slice(0, j)), tempArr[j], ...quickSort(tempArr.slice(j + 1, tempArr.length))];
}

console.log(quickSort([2, 1, 4, 3, 5]));
