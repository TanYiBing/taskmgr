import { Action } from '@ngrx/store';
import { Project, User } from '../domain';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum ProjectActionTypes {
  ADD = '[Project] Add',
  ADD_SUCCESS = '[Project] Add Success',
  ADD_FAIL = '[Project] Add Fail',
  DELETE = '[Project] Delete',
  DELETE_SUCCESS = '[Project] Delete Success',
  DELETE_FAIL = '[Project] Delete Fail',
  UPDATE = '[Project] Update',
  UPDATE_SUCCESS = '[Project] Update Success',
  UPDATE_FAIL = '[Project] Update Fail',
  LOAD = '[Project] Load',
  LOAD_SUCCESS = '[Project] Load Success',
  LOAD_FAIL = '[Project] Load Fail',
  INVITE = '[Project] Invite',
  INVITE_SUCCESS = '[Project] Invite Success',
  INVITE_FAIL = '[Project] Invite Fail',
  SELECT_PROJECT = '[Project] Select Project'
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 */
export class AddAction implements Action {
  readonly type = ProjectActionTypes.ADD;

  constructor(public payload: Project) { }
}

export class AddSuccessAction implements Action {
  readonly type = ProjectActionTypes.ADD_SUCCESS;

  constructor(public payload: Project) { }
}

export class AddFailAction implements Action {
  readonly type = ProjectActionTypes.ADD_FAIL;

  // 错误时传递一个错误信息，所以是string
  constructor(public payload: string) { }
}

export class DeleteAction implements Action {
  readonly type = ProjectActionTypes.DELETE;

  constructor(public payload: null) { }
}

export class DeleteSuccessAction implements Action {
  readonly type = ProjectActionTypes.DELETE_SUCCESS;

  constructor(public payload: Project) { }
}

export class DeleteFailAction implements Action {
  readonly type = ProjectActionTypes.DELETE_FAIL;

  // 错误时传递一个错误信息，所以是string
  constructor(public payload: string) { }
}

export class UpdateAction implements Action {
  readonly type = ProjectActionTypes.UPDATE;

  constructor(public payload: Project) { }
}

export class UpdateSuccessAction implements Action {
  readonly type = ProjectActionTypes.UPDATE_SUCCESS;

  constructor(public payload: Project) { }
}

export class UpdateFailAction implements Action {
  readonly type = ProjectActionTypes.UPDATE_FAIL;

  // 错误时传递一个错误信息，所以是string
  constructor(public payload: string) { }
}

export class LoadAction implements Action {
  readonly type = ProjectActionTypes.LOAD;
}

export class LoadSuccessAction implements Action {
  readonly type = ProjectActionTypes.LOAD_SUCCESS;

  constructor(public payload: Project[]) { }
}

export class LoadFailAction implements Action {
  readonly type = ProjectActionTypes.LOAD_FAIL;

  // 错误时传递一个错误信息，所以是string
  constructor(public payload: string) { }
}

export class InviteAction implements Action {
  readonly type = ProjectActionTypes.INVITE;

  constructor(public payload: { projectId: string, members: User[] }) { }
}

export class InviteSuccessAction implements Action {
  readonly type = ProjectActionTypes.INVITE_SUCCESS;

  constructor(public payload: Project) { }
}

export class InviteFailAction implements Action {
  readonly type = ProjectActionTypes.INVITE_FAIL;

  // 错误时传递一个错误信息，所以是string
  constructor(public payload: string) { }
}

export class SelectAction implements Action {
  readonly type = ProjectActionTypes.SELECT_PROJECT;

  // 错误时传递一个错误信息，所以是string
  constructor(public payload: Project) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type ProjectActions = AddAction
  | AddSuccessAction
  | AddFailAction
  | DeleteAction
  | DeleteSuccessAction
  | DeleteFailAction
  | UpdateAction
  | UpdateSuccessAction
  | UpdateFailAction
  | LoadAction
  | LoadSuccessAction
  | LoadFailAction
  | InviteAction
  | InviteSuccessAction
  | InviteFailAction
  | SelectAction;

