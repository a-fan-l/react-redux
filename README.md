# React Redux Demo

这个项目演示了React + Redux的核心概念，包括Store、Action、Reducer、Middleware等。

## 项目结构

```
src/
├── actions/
│   └── counterActions.js      # Action Creators
├── components/
│   └── Counter.js             # React组件
├── middleware/
│   ├── loggerMiddleware.js    # 日志中间件
│   └── asyncMiddleware.js     # 异步中间件
├── reducers/
│   ├── counterReducer.js      # Counter Reducer
│   └── index.js              # 根Reducer
├── store/
│   └── store.js              # Store配置
├── App.js                    # 主应用组件
└── index.js                  # 入口文件
```

## Redux核心概念

### 1. Store (store.js)
- 应用状态的单一数据源
- 使用`createStore()`创建
- 通过`applyMiddleware()`应用中间件
- 提供`getState()`, `dispatch()`, `subscribe()`方法

### 2. Action (counterActions.js)
- 描述状态变化的普通对象
- 必须有`type`属性
- Action Creator返回action对象
- 异步action使用thunk模式

### 3. Reducer (counterReducer.js)
- 纯函数，接收当前状态和action
- 返回新的状态对象（不可变）
- 根据action.type处理不同逻辑
- 使用switch语句处理不同action

### 4. Current State
- Store中存储的当前应用状态
- 通过`store.getState()`获取
- 在组件中通过`mapStateToProps`映射到props

### 5. Middleware
- 拦截action进行额外处理
- Logger Middleware: 记录action和状态变化
- Async Middleware: 处理异步action

### 6. Provider (核心桥梁)
- 基于React Context API实现
- 将Redux Store传递给所有组件
- 管理store订阅和状态更新
- 提供响应式的状态访问

## Provider 原理详解

### 🎯 Provider 的本质
Provider 是 React-Redux 与 React 组件之间的桥梁，通过 Context API 实现状态传递：

```javascript
<Provider store={store}>
  <App />
</Provider>
```

### 🔧 工作机制
1. **Context 创建**: 使用 `React.createContext(null)`
2. **Store 传递**: 通过 Context Provider 传递 store 实例
3. **状态订阅**: 监听 store 变化，触发组件更新
4. **数据消费**: 组件通过 useSelector/useDispatch 访问数据

### 📊 数据流
```
用户交互 → Action → Provider → Store → Reducer → Provider → Context → 组件更新
```

## IO 函子详解

### 🎯 IO 函子的本质
IO 函子是函数式编程中处理副作用的核心工具，它将不纯的操作包装成纯函数：

```javascript
// 创建 IO 实例（延迟执行）
const readFileIO = new IO(() => fs.readFileSync('data.txt', 'utf8'));

// 组合操作（纯函数）
const processFileIO = readFileIO
  .map(content => content.toUpperCase())
  .chain(upperContent => new IO(() => console.log(upperContent)));

// 执行副作用
processFileIO.unsafePerformIO();
```

### 🔧 IO 函子特性
1. **延迟执行**: 创建时不执行，调用 `unsafePerformIO()` 时才执行
2. **组合性**: 支持 `map` 和 `chain` 操作进行函数式组合
3. **类型安全**: 提供强类型保证，避免运行时错误
4. **可测试性**: 纯函数易于单元测试

## Middleware 详解

### 🎯 Middleware 的本质
Middleware 是软件架构中的核心模式，用于在处理流程中插入自定义逻辑：

```javascript
// Redux Middleware
const logger = store => next => action => {
  console.log('Action:', action);
  const result = next(action);
  console.log('New state:', store.getState());
  return result;
};

// Express Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
```

### 🔧 Middleware 模式
1. **拦截处理**: 在请求/动作到达最终处理器前进行拦截
2. **链式传递**: 通过 `next()` 函数将控制权传递给下一个中间件
3. **关注点分离**: 将横切关注点（如日志、认证）从业务逻辑中分离
4. **可组合性**: 支持动态组合和配置

### 📋 中间件类型
- **Redux Middleware**: 处理 Redux actions
- **Web Middleware**: 处理 HTTP 请求
- **函数式 Middleware**: 通用函数式组合

## IO 函子 vs Middleware

| 特性 | IO 函子 | Middleware |
|------|---------|------------|
| 关注点 | 副作用管理 | 处理流程控制 |
| 执行方式 | 延迟执行 | 顺序执行 |
| 组合方式 | 函数组合 | 链式调用 |
| 应用场景 | 函数式编程 | 架构模式 |
| 测试性 | 纯函数测试 | 集成测试 |

## 运行项目

```bash
npm start
```

## 功能演示

1. **同步操作**: 增加/减少/重置计数器
2. **异步操作**: 1秒后增加计数器
3. **状态监控**: 控制台显示状态变化
4. **中间件演示**: Logger记录所有操作
5. **Provider 原理**: 展示 Context 工作机制
6. **简化版实现**: 手写 Provider 演示内部原理
7. **IO 函子演示**: 函数式副作用管理
8. **Middleware 演示**: 中间件模式应用
9. **IO 函子深度探索**: 详细的IO函子使用演示

## 控制台输出

打开浏览器开发者工具的Console标签，可以看到：
- 初始状态
- 每次action的分发
- 中间件处理过程
- 状态更新前后对比
