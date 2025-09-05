// Logger Middleware - 记录action和状态变化
const loggerMiddleware = (store) => (next) => (action) => {
  console.log('Logger Middleware🍎:');
  console.log('Action🍎:', action);
  console.log('Before State🍎:', store.getState());

  console.log('next🍎:', next);
  // 调用下一个middleware或reducer
  const result = next(action);

  console.log('After State🍎:', store.getState());
  console.log('---');
  

  return result;
};

export default loggerMiddleware;
