const initialState = {
    count: 0,
}

const addReducer = (state = initialState, type) => {
    switch(type) {
        case 'ADD-TWO':
            return {
                ...state,
                count: state.count + 2,
            }
        case 'ADD-FOUR':
            return {
                ...state,
                count: state.count + 4,
            }
        default:
            return state;
    }
}
export default addReducer;