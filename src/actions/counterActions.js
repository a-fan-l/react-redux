// Action Types - 定义action类型常量
export const INCREMENT = 'INCREMENT';
export const DECREMENT = 'DECREMENT';
export const RESET = 'RESET';
export const INCREMENT_ASYNC = 'INCREMENT_ASYNC';

// Action Creators - 创建action的函数
export const increment = () => ({
  type: INCREMENT,
});

export const decrement = () => ({
  type: DECREMENT,
});

export const reset = () => ({
  type: RESET,
});

export const incrementAsync = () => ({
  type: INCREMENT_ASYNC,
});

// 异步Action Creator (使用thunk middleware)
export const incrementAsyncThunk = () => {
  return (dispatch, getState) => {
    console.log('当前状态:', getState());
    setTimeout(() => {
      dispatch(increment());
    }, 1000);
  };
};
