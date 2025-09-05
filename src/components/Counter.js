import React from 'react';
import { connect } from 'react-redux';
import {
  increment,
  decrement,
  reset,
  incrementAsyncThunk
} from '../actions/counterActions';

class Counter extends React.Component {
  render() {
    const { count, loading, lastAction, increment, decrement, reset, incrementAsync } = this.props;

    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Redux Counter Demo</h1>

        <div style={{ margin: '20px 0' }}>
          <h2>计数器: {count}</h2>
          {loading && <p style={{ color: 'orange' }}>正在异步增加...</p>}
          <p>最后操作: {lastAction}</p>
        </div>

        <div>
          <button
            onClick={increment}
            style={{ margin: '5px', padding: '10px 20px' }}
          >
            增加 (+)
          </button>

          <button
            onClick={decrement}
            style={{ margin: '5px', padding: '10px 20px' }}
          >
            减少 (-)
          </button>

          <button
            onClick={reset}
            style={{ margin: '5px', padding: '10px 20px' }}
          >
            重置
          </button>

          <button
            onClick={incrementAsync}
            style={{ margin: '5px', padding: '10px 20px' }}
            disabled={loading}
          >
            异步增加 (1秒后)
          </button>
        </div>

        <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
          <h3>Redux 核心概念演示:</h3>
          <ul>
            <li><strong>Store:</strong> 存储应用状态的单一数据源</li>
            <li><strong>Action:</strong> 描述状态变化的对象</li>
            <li><strong>Reducer:</strong> 纯函数，根据action更新状态</li>
            <li><strong>Middleware:</strong> 拦截action进行额外处理</li>
            <li><strong>Current State:</strong> {JSON.stringify({ count, loading, lastAction })}</li>
          </ul>
        </div>
      </div>
    );
  }
}

// mapStateToProps - 将store中的状态映射到组件props
const mapStateToProps = (state) => ({
  count: state.counter.count,
  loading: state.counter.loading,
  lastAction: state.counter.lastAction,
});

// mapDispatchToProps - 将action creators映射到组件props
const mapDispatchToProps = {
  increment,
  decrement,
  reset,
  incrementAsync: incrementAsyncThunk,
};

// 连接组件到Redux store
export default connect(mapStateToProps, mapDispatchToProps)(Counter);
