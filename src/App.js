import React from 'react';
import Counter from './components/Counter';

function App() {
  return (
    <div className="App">
      <h1 style={{ textAlign: 'center', margin: '20px' }}>
        React Redux Demo - Provider 原理演示
      </h1>

      {/* 原始的 Counter 组件演示 */}
      <Counter />
    </div>
  );
}

export default App;
