import {combineReducers} from "redux";
import loggedStatusReducer from "./loggedStatusReducer";
import currentUserReducer from "./currentUserReducer";
import currentItemsReducer from "./currentItemsReducer";
import itemsLoadingStatusReducer from "./itemsLoadingStatusReducer";
import currentTagsReducer from "./currentTagsReducer";
import tagsLoadingStatusReducer from "./tagsLoadingStatusReducer";
import currentItemsPageReducer from "./currentItemsPageReducer";
import showManageFormReducer from "./showManageFormReducer";
import itemToEditReducer from "./itemToEditReducer";

const rootReducer = combineReducers({
    isLogged: loggedStatusReducer,
    loggedUser: currentUserReducer,
    currentItems: currentItemsReducer,
    itemsLoading: itemsLoadingStatusReducer,
    currentTags: currentTagsReducer,
    tagsLoadingStatus: tagsLoadingStatusReducer,
    currentPage: currentItemsPageReducer,
    isShownManageForm: showManageFormReducer,
    itemToEdit: itemToEditReducer
});

export default rootReducer;

