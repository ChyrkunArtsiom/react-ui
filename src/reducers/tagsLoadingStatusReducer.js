const tagsLoadingStatusReducer = (state = true, action) => {
    switch (action.type) {
        case 'TAGS_ARE_LOADING': {
            console.log("Items are loading");
            return true;
        }
        case 'TAGS_ARE_LOADED': {
            console.log("Items are loaded");
            return false;
        }
        default: {
            return state;
        }
    }
}

export default tagsLoadingStatusReducer;