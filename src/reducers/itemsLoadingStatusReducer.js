const itemsLoadingStatusReducer = (state = true, action) => {
    switch (action.type) {
        case 'ITEMS_ARE_LOADING': {
            console.log("Items are loading");
            return true;
        }
        case 'ITEMS_ARE_LOADED': {
            console.log("Items are loaded");
            return false;
        }
        default: {
            return state;
        }
    }
}

export default itemsLoadingStatusReducer;