import { combineReducers } from 'redux';
import counterReducer from './counterReducer';
import addReducer from './addReducer';

// 根Reducer - 组合所有子reducer
const rootReducer = combineReducers({
  counter: counterReducer,
  // 可以在这里添加更多reducer
  add: addReducer,
});

export default rootReducer;
