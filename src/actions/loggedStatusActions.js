//Actions executed when login or logout happens
import {createAction} from "@reduxjs/toolkit";

export const loggedStatus = createAction('LOGGED');
export const unloggedStatus = createAction('UNLOGGED');