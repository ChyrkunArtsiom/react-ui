//Reducer for handling current page
const currentItemsPageReducer = (state = 1, action) => {
    switch (action.type) {
        case 'NEXT_PAGE': {
            return state + 1;
        }
        case 'RESET_PAGE': {
            return 1;
        }
        default: {
            return state;
        }
    }
}

export default currentItemsPageReducer;