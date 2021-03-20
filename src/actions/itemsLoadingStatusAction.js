import {createAction} from "@reduxjs/toolkit";

export const itemsAreLoading = createAction('ITEMS_ARE_LOADING');
export const itemsAreLoaded = createAction('ITEMS_ARE_LOADED');