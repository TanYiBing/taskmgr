import { Action } from '@ngrx/store';
import { Auth, User } from '../domain';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login Success',
  LOGIN_FAIL = '[Auth] Login Fail',
  REGISTER = '[Auth] Register',
  REGISTER_SUCCESS = '[Auth] Register Success',
  REGISTER_FAIL = '[Auth] Register Fail',
  LOGOUT = '[Auth] Logout',
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 */
export class LoginAction implements Action {
  readonly type = AuthActionTypes.LOGIN;

  constructor(public payload: {email: string; password: string}) { }
}

export class LoginSuccessAction implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;

  constructor(public payload: Auth) { }
}

export class LoginFailAction implements Action {
  readonly type = AuthActionTypes.LOGIN_FAIL;

  // 错误时传递一个错误信息，所以是string
  constructor(public payload: string) { }
}

export class RegisterAction implements Action {
  readonly type = AuthActionTypes.REGISTER;

  constructor(public payload: User) { }
}

export class RegisterSuccessAction implements Action {
  readonly type = AuthActionTypes.REGISTER_SUCCESS;

  constructor(public payload: Auth) { }
}

export class RegisterFailAction implements Action {
  readonly type = AuthActionTypes.REGISTER_FAIL;

  // 错误时传递一个错误信息，所以是string
  constructor(public payload: string) { }
}

export class LogoutAction implements Action {
  readonly type = AuthActionTypes.LOGOUT;

  // 错误时传递一个错误信息，所以是string
  constructor(public payload: null) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type AuthActions = LoginAction
  | LoginSuccessAction
  | LoginFailAction
  | RegisterAction
  | RegisterSuccessAction
  | RegisterFailAction
  | LogoutAction;

