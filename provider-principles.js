// React-Redux Provider 原理详解

// 1. React Context 基础
// Provider 基于 React Context API 工作
const ReactReduxContext = React.createContext(null);

// 2. Provider 组件的简化实现
class Provider extends React.Component {
  constructor(props) {
    super(props);

    // 创建Context的Provider组件
    this.contextValue = {
      store: props.store,
      subscription: null
    };

    // 订阅store变化，触发组件更新
    this.subscription = new Subscription(props.store, () => {
      this.forceUpdate();
    });
  }

  render() {
    return (
      <ReactReduxContext.Provider value={this.contextValue}>
        {this.props.children}
      </ReactReduxContext.Provider>
    );
  }
}

// 3. connect 函数如何使用Context
function connect(mapStateToProps, mapDispatchToProps) {
  return function(Component) {
    class ConnectedComponent extends React.Component {
      static contextType = ReactReduxContext;

      constructor(props, context) {
        super(props, context);

        // 从Context获取store
        this.store = context.store;

        // 计算初始状态
        this.state = {
          storeState: mapStateToProps(this.store.getState(), props)
        };
      }

      componentDidMount() {
        // 订阅store变化
        this.unsubscribe = this.store.subscribe(() => {
          const newState = mapStateToProps(this.store.getState(), this.props);
          this.setState({ storeState: newState });
        });
      }

      render() {
        const dispatchProps = mapDispatchToProps ?
          mapDispatchToProps(this.store.dispatch, this.props) :
          { dispatch: this.store.dispatch };

        return (
          <Component
            {...this.props}
            {...this.state.storeState}
            {...dispatchProps}
          />
        );
      }
    }

    return ConnectedComponent;
  };
}

// 4. Hooks (useSelector, useDispatch) 的实现原理
function useSelector(selector) {
  const context = React.useContext(ReactReduxContext);
  const { store } = context;

  // 使用useState和useEffect实现状态订阅
  const [state, setState] = React.useState(() =>
    selector(store.getState())
  );

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const newState = selector(store.getState());
      setState(newState);
    });

    return unsubscribe;
  }, [store, selector]);

  return state;
}

function useDispatch() {
  const context = React.useContext(ReactReduxContext);
  return context.store.dispatch;
}

export {
  Provider,
  connect,
  useSelector,
  useDispatch
};
