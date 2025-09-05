// Initial State - 初始状态
const initialState = {
  count: 0,
  loading: false,
  lastAction: null,
};

// Reducer Function - 纯函数，接收当前状态和action，返回新状态
const counterReducer = (state = initialState, action) => {
  console.log('Reducer called with action:', action);

  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1,
        lastAction: 'INCREMENT',
      };

    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1,
        lastAction: 'DECREMENT',
      };

    case 'RESET':
      return {
        ...state,
        count: 0,
        lastAction: 'RESET',
      };

    case 'INCREMENT_ASYNC':
      return {
        ...state,
        loading: true,
        lastAction: 'INCREMENT_ASYNC_START',
      };

    default:
      return state;
  }
};

export default counterReducer;
