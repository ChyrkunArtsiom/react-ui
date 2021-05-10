const addButtonVisibilityStatus = (state = false, action) => {
    switch (action.type) {
        case 'SHOW_ADD_BUTTON': {
            return true;
        }
        case 'HIDE_ADD_BUTTON': {
            return false;
        }
        default: {
            return state;
        }
    }
}

export default addButtonVisibilityStatus;