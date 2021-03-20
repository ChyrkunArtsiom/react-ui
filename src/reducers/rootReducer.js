import {combineReducers} from "redux";
import loggedStatusReducer from "./loggedStatusReducer";
import currentUserReducer from "./currentUserReducer";
import currentItemsReducer from "./currentItemsReducer";
import itemsLoadingStatusReducer from "./itemsLoadingStatusReducer";
import currentTagsReducer from "./currentTagsReducer";
import tagsLoadingStatusReducer from "./tagsLoadingStatusReducer";
import currentItemsPageReducer from "./currentItemsPageReducer";

const rootReducer = combineReducers({
    isLogged: loggedStatusReducer,
    loggedUser: currentUserReducer,
    currentItems: currentItemsReducer,
    itemsLoading: itemsLoadingStatusReducer,
    currentTags: currentTagsReducer,
    tagsLoadingStatus: tagsLoadingStatusReducer,
    currentPage: currentItemsPageReducer
});

export default rootReducer;

