import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store/store';
import App from './App';

console.log('初始状态:', store.getState());

const container = document.getElementById('root');
const root = createRoot(container);

// 使用Provider将store传递给所有组件
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
