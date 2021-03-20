//Reducer for handling isLogged
const loggedStatusReducer = (state = Boolean(localStorage.getItem('isLogged')), action) => {
    switch (action.type) {
        case 'LOGGED': {
            return true;
        }
        case 'UNLOGGED': {
            return false;
        }
        default: {
            return state;
        }
    }
}

export default loggedStatusReducer;