// Async Middleware - 处理异步action
const asyncMiddleware = (store) => (next) => (action) => {
  if (typeof action === 'function') {
    console.log('Async Middleware🍌:', store, next, action);
    console.log('Async Middleware: 检测到函数action，执行异步操作');
    return action(store.dispatch, store.getState);
  }

  return next(action);
};

export default asyncMiddleware;

// asyncMiddleware 是一个三层嵌套的高阶函数，它接收一个 store 参数，返回一个函数，该函数接收一个 next 参数，返回一个函数，该函数接收一个 action 参数。
// const asyncMiddleware = (store) {
//  return (next) => {
//    return (action) => {
//    } 
//  }
// }

// 为什么设计成三层嵌套？
// 1. 延迟执行 (Lazy Evaluation)
// 2. 函数式组合 (Function Composition)
// 3. 拦截控制 (Interception Control)