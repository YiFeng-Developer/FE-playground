// 优先级类型（数值越小优先级越高）
const Priority = {
  Immediate: 0, // 用户交互、动画等
  High: 1, // 数据更新
  Low: 2, // 大数据渲染、日志等
};

// 任务队列（按优先级分组）
const taskQueue = {
  [Priority.Immediate]: [],
  [Priority.High]: [],
  [Priority.Low]: [],
};

let isScheduling = false; // 是否正在调度中
let currentPriority = Priority.Low; // 当前执行任务的优先级

// 添加任务到队列
function scheduleTask(task, priority) {
  taskQueue[priority].push(task);
}
