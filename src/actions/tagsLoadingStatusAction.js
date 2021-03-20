import {createAction} from "@reduxjs/toolkit";

export const tagsAreLoading = createAction('TAGS_ARE_LOADING');
export const tagsAreLoaded = createAction('TAGS_ARE_LOADED');