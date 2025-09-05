import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import loggerMiddleware from '../middleware/loggerMiddleware';
import asyncMiddleware from '../middleware/asyncMiddleware';

// 创建Store
const store = createStore(
  rootReducer,
  // 应用middleware
  applyMiddleware(
    loggerMiddleware,  // 日志middleware
    asyncMiddleware    // 异步middleware
  )
);

console.log('Store🍎:', store);

// 订阅状态变化
store.subscribe(() => {
  console.log('Store updated! Current state:', store.getState());
});

export default store;
