const itemToEditReducer = (state = null, action) => {
    switch (action.type) {
        case 'PUT_ITEM_INTO_FORM': {
            return action.payload;
        }
        case 'DELETE_ITEM_FROM_FORM': {
            return null;
        }
        default: {
            return state;
        }
    }
}

export default itemToEditReducer;