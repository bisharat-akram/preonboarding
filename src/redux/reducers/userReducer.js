const initialState = {};
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'STOREUSER':
            return action.payload;
        case 'REMOVEUSER':
        return {}
        default:
            return state;
    }
}
export default userReducer;