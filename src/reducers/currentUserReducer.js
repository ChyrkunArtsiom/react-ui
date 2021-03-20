//Reducer for handling loggedUser
const currentUserReducer = (state = localStorage.getItem('login'), action) => {
    if (state === undefined) {
        return '';
    }
    switch (action.type) {
        case 'LOGGED': {
            return action.payload;
        }
        case 'UNLOGGED': {
            return '';
        }
        default: {
            return state;
        }
    }
};

export default currentUserReducer;