//Reducer for handling loggedUser
const itemsCleaningStatus = (state = false, action) => {
    if (state === undefined) {
        return '';
    }
    switch (action.type) {
        case 'CLEAN_ITEMS': {
            console.log("CLEAN ITEMS");
            return true;
        }
        case 'KEEP_ITEMS': {
            return false;
        }
        default: {
            return state;
        }
    }
};

export default itemsCleaningStatus;