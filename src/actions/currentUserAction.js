//Actions executed when changes current user
import {createAction} from "@reduxjs/toolkit";

export const currentUserAction = createAction('LOGGED');
export const unlogCurrentUserAction = createAction('UNLOGGED');
