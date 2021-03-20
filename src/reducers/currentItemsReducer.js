//Reducer for handling loaded items
const currentItemsReducer = (state = [], action) => {
    switch (action.type) {
        case 'PUT_ITEMS': {
            return state.concat(action.payload);;
        }
        case 'DELETE_ITEMS': {
            return [];
        }
        default: {
            return state;
        }
    }
}

export default currentItemsReducer;