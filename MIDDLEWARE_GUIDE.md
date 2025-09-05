# Middleware (中间件) 详解

## 🎯 Middleware 的本质

Middleware 是软件架构中的一个重要模式，它允许在**请求处理流程**中插入自定义逻辑，实现**关注点分离**和**代码复用**。

## 🔧 基本概念

### 1. 什么是 Middleware？
```javascript
// Middleware 是一个函数，接收三个参数：
// 1. 请求对象
// 2. 响应对象
// 3. 下一个 middleware 函数
function loggerMiddleware(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next(); // 调用下一个中间件
}
```

### 2. Middleware 的执行流程
```javascript
// 中间件链的执行顺序
app.use(loggerMiddleware);
app.use(authMiddleware);
app.use(router);

// 执行流程：
// 1. loggerMiddleware 执行
// 2. 调用 next() 传递给 authMiddleware
// 3. authMiddleware 执行
// 4. 调用 next() 传递给 router
// 5. router 处理请求
```

## 📋 Middleware 的分类

### 1. 按应用场景分类

#### Web 服务器中间件 (Express/Koa)
```javascript
// Express 中间件
const express = require('express');
const app = express();

// 日志中间件
app.use((req, res, next) => {
  console.log(`${Date.now()} ${req.method} ${req.url}`);
  next();
});

// 认证中间件
app.use((req, res, next) => {
  if (req.headers.authorization) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
});

// 路由中间件
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});
```

#### Redux 中间件
```javascript
// Redux 中间件
const logger = store => next => action => {
  console.log('Action:', action);
  const result = next(action);
  console.log('New state:', store.getState());
  return result;
};

const thunk = store => next => action => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }
  return next(action);
};
```

#### 函数式中间件
```javascript
// 函数式编程中的中间件
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);

const middleware1 = next => action => {
  console.log('Before 1');
  const result = next(action);
  console.log('After 1');
  return result;
};

const middleware2 = next => action => {
  console.log('Before 2');
  const result = next(action);
  console.log('After 2');
  return result;
};

const chain = compose(middleware1, middleware2);
```

## 🏗️ 中间件的实现模式

### 1. 洋葱模型 (Onion Model)
```javascript
// 中间件像洋葱一样层层包裹
const middleware1 = next => action => {
  console.log('外层开始');
  const result = next(action);
  console.log('外层结束');
  return result;
};

const middleware2 = next => action => {
  console.log('内层开始');
  const result = next(action);
  console.log('内层结束');
  return result;
};

// 执行顺序：
// 外层开始 → 内层开始 → 内层结束 → 外层结束
```

### 2. 责任链模式 (Chain of Responsibility)
```javascript
class MiddlewareChain {
  constructor() {
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  execute(context) {
    let index = 0;

    const next = () => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index++];
        return middleware(context, next);
      }
    };

    return next();
  }
}

// 使用示例
const chain = new MiddlewareChain()
  .use(authMiddleware)
  .use(loggerMiddleware)
  .use(handlerMiddleware);

chain.execute(request);
```

### 3. 组合函数模式 (Composition)
```javascript
// 使用函数组合实现中间件
const compose = (...middlewares) => {
  return middlewares.reduce((acc, middleware) => {
    return (context) => middleware(context, acc);
  }, () => {});
};

// 使用示例
const composedMiddleware = compose(
  loggerMiddleware,
  authMiddleware,
  errorHandlerMiddleware
);

composedMiddleware(context);
```

## 🎨 实际应用场景

### 1. Web 框架中间件

#### Express.js 中间件
```javascript
const express = require('express');
const app = express();

// CORS 中间件
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// 解析 JSON 中间件
app.use(express.json());

// 自定义认证中间件
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    // 验证 token
    req.user = decodeToken(token);
    next();
  } else {
    res.status(401).json({ error: 'No token provided' });
  }
};

// 使用认证中间件
app.get('/api/users', authenticate, (req, res) => {
  res.json({ users: [], user: req.user });
});
```

#### Koa.js 中间件
```javascript
const Koa = require('koa');
const app = new Koa();

// Koa 中间件使用 async/await
const logger = async (ctx, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${duration}ms`);
};

const auth = async (ctx, next) => {
  const token = ctx.headers.authorization;
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: 'No token provided' };
    return;
  }
  await next();
};

app.use(logger);
app.use(auth);
```

### 2. Redux 中间件

#### Logger 中间件
```javascript
const logger = store => next => action => {
  console.group(action.type);
  console.log('Previous state:', store.getState());
  console.log('Action:', action);

  const result = next(action);

  console.log('Next state:', store.getState());
  console.groupEnd();

  return result;
};
```

#### Thunk 中间件
```javascript
const thunk = store => next => action => {
  if (typeof action === 'function') {
    return action(store.dispatch, store.getState);
  }

  return next(action);
};

// 使用示例
const asyncAction = () => {
  return (dispatch, getState) => {
    dispatch({ type: 'LOADING_START' });

    fetch('/api/data')
      .then(response => response.json())
      .then(data => dispatch({ type: 'DATA_LOADED', payload: data }))
      .catch(error => dispatch({ type: 'ERROR', payload: error }));
  };
};
```

#### Saga 中间件
```javascript
import { call, put, takeEvery } from 'redux-saga/effects';

function* fetchUser(action) {
  try {
    const user = yield call(fetch, `/api/users/${action.payload.id}`);
    yield put({ type: 'USER_FETCH_SUCCEEDED', user: user });
  } catch (e) {
    yield put({ type: 'USER_FETCH_FAILED', message: e.message });
  }
}

function* userSaga() {
  yield takeEvery('USER_FETCH_REQUESTED', fetchUser);
}
```

### 3. 函数式编程中间件

#### Redux-Style Middleware
```javascript
const applyMiddleware = (...middlewares) => store => {
  if (middlewares.length === 0) {
    return dispatch => dispatch;
  }

  if (middlewares.length === 1) {
    return middlewares[0](store);
  }

  const boundMiddlewares = middlewares.map(middleware => middleware(store));

  return boundMiddlewares.reduce((a, b) => next => a(b(next)));
};
```

#### HTTP 请求中间件
```javascript
const httpMiddleware = next => request => {
  // 请求前处理
  console.log('Making request to:', request.url);

  // 添加认证头
  request.headers = {
    ...request.headers,
    'Authorization': `Bearer ${getToken()}`
  };

  return next(request).then(response => {
    // 响应后处理
    if (response.status === 401) {
      // 处理认证失败
      redirectToLogin();
    }

    return response;
  });
};
```

## ⚡ 性能优化

### 1. 中间件缓存
```javascript
const memoizeMiddleware = (middleware) => {
  const cache = new Map();

  return (store) => {
    const key = store.getState();

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = middleware(store);
    cache.set(key, result);
    return result;
  };
};
```

### 2. 条件执行
```javascript
const conditionalMiddleware = (condition, middleware) => {
  return store => next => action => {
    if (condition(action, store.getState())) {
      return middleware(store)(next)(action);
    }
    return next(action);
  };
};

// 只在开发环境下启用 logger
const devLogger = conditionalMiddleware(
  () => process.env.NODE_ENV === 'development',
  loggerMiddleware
);
```

### 3. 异步优化
```javascript
const asyncMiddleware = store => next => action => {
  if (action.async) {
    // 异步处理
    setTimeout(() => next(action), 0);
    return;
  }

  return next(action);
};
```

## 🎯 设计模式

### 1. 装饰器模式
```javascript
class RequestHandler {
  handle(request) {
    // 基础处理逻辑
  }
}

class AuthMiddleware {
  constructor(handler) {
    this.handler = handler;
  }

  handle(request) {
    // 认证逻辑
    if (this.authenticate(request)) {
      return this.handler.handle(request);
    }
    throw new Error('Unauthorized');
  }
}

class LoggerMiddleware {
  constructor(handler) {
    this.handler = handler;
  }

  handle(request) {
    console.log(`Handling ${request.method} ${request.url}`);
    return this.handler.handle(request);
  }
}

// 使用装饰器
const handler = new LoggerMiddleware(
  new AuthMiddleware(
    new RequestHandler()
  )
);
```

### 2. 管道模式
```javascript
class Pipeline {
  constructor() {
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  run(input) {
    return this.middlewares.reduce((result, middleware) => {
      return result.then(middleware);
    }, Promise.resolve(input));
  }
}

// 使用管道
const pipeline = new Pipeline()
  .use(validateInput)
  .use(authenticate)
  .use(processData)
  .use(formatOutput);

pipeline.run(request).then(result => {
  console.log('Pipeline completed:', result);
});
```

## 💡 最佳实践

### 1. 中间件顺序
```javascript
// 推荐的中间件顺序
app.use(corsMiddleware);        // CORS 应该最早
app.use(loggerMiddleware);      // 日志记录
app.use(bodyParserMiddleware);  // 解析请求体
app.use(authMiddleware);        // 认证
app.use(router);                // 路由处理
```

### 2. 错误处理
```javascript
const errorHandler = (error, req, res, next) => {
  console.error(error.stack);

  if (error.type === 'ValidationError') {
    res.status(400).json({ error: error.message });
  } else if (error.type === 'AuthenticationError') {
    res.status(401).json({ error: 'Unauthorized' });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

app.use(errorHandler);
```

### 3. 中间件测试
```javascript
const testMiddleware = (middleware) => {
  const mockReq = { method: 'GET', url: '/test' };
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  const mockNext = jest.fn();

  middleware(mockReq, mockRes, mockNext);

  expect(mockNext).toHaveBeenCalled();
};
```

## 🔄 Middleware vs IO 函子

| 特性 | Middleware | IO 函子 |
|------|------------|---------|
| 关注点 | 处理流程 | 副作用管理 |
| 执行方式 | 顺序执行 | 延迟执行 |
| 组合方式 | 链式调用 | 函数组合 |
| 错误处理 | 异常传递 | 显式处理 |
| 测试性 | 依赖注入 | 纯函数 |

## 🎯 总结

Middleware 是现代软件架构中的核心模式：

- **关注点分离**: 将横切关注点从业务逻辑中分离
- **代码复用**: 中间件可以在多个地方重复使用
- **易于扩展**: 可以轻松添加新功能而不修改现有代码
- **易于测试**: 每个中间件都可以独立测试
- **灵活组合**: 支持不同的组合模式和执行顺序

掌握 Middleware 模式将大大提升你的代码组织能力和架构设计水平！
