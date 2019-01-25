import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { ProjectService } from '../services/project.service';
import { Project, User } from '../domain';
import * as routerActions from '../actions/router.action';
import * as actions from '../actions/project.action';
import * as fromRoot from '../reducers';

@Injectable()
export class ProjectEffects {

  @Effect()
  loadProjects$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ProjectActionTypes.LOAD),
    withLatestFrom(this.store$.pipe(select(fromRoot.getAuthState))),
    switchMap(([_, auth]) =>
      this.service.get(auth.userId).pipe(
        map(projects => new actions.LoadSuccessAction(projects)),
        catchError(err =>
          of(new actions.LoadFailAction(JSON.stringify(err)))
        )
      )
    )
  );

  @Effect()
  addProject$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ProjectActionTypes.ADD),
    map((action: actions.AddAction) => action.payload),
    withLatestFrom(this.store$.pipe(select(fromRoot.getAuthState))),
    switchMap(([project, auth]) => {
      const added = { ...project, members: [`${auth.user.id}`] };
      return this.service.add(added).pipe(
        map(returned => new actions.AddSuccessAction(returned)),
        catchError(err =>
          of(new actions.AddFailAction(JSON.stringify(err)))
        )
      );
    })
  );

  @Effect()
  updateProject$: Observable<Action> = this.actions$.pipe(
    ofType<actions.UpdateAction>(actions.ProjectActionTypes.UPDATE),
    map(action => action.payload),
    switchMap(project =>
      this.service.update(project).pipe(
        map(returned => new actions.UpdateSuccessAction(returned)),
        catchError(err =>
          of(new actions.UpdateFailAction(JSON.stringify(err)))
        )
      )
    )
  );

  @Effect()
  removeProject$: Observable<Action> = this.actions$.pipe(
    ofType<actions.DeleteAction>(actions.ProjectActionTypes.DELETE),
    map(action => action.payload),
    switchMap(project =>
      this.service.del(project).pipe(
        map(returned => new actions.DeleteSuccessAction(returned)),
        catchError(err =>
          of(new actions.DeleteFailAction(JSON.stringify(err)))
        )
      )
    )
  );

  @Effect()
  selectProject$: Observable<Action> = this.actions$.pipe(
    ofType<actions.SelectAction>(actions.ProjectActionTypes.SELECT_PROJECT),
    map(action => action.payload),
    map(project => new routerActions.Go({ path: [`/tasklists/${project.id}`] }))
  );

  // @Effect()
  // toLoadUsersByPrj$: Observable<Action> = this.actions$.pipe(
  //   ofType<actions.SelectAction>(actions.ProjectActionTypes.SELECT_PROJECT),
  //   map(action => action.payload),
  //   map(project => new userActions.LoadUsersByPrjAction(<string>project.id))
  // );

  // @Effect()
  // startInitTaskLists$: Observable<Action> = this.actions$.pipe(
  //   ofType<actions.AddProjectSuccessAction>(actions.ProjectActionTypes.ADD_SUCCESS),
  //   map(action => action.payload),
  //   map(project => new tasklistActions.InitTaskListsAction(project))
  // );



  // @Effect()
  // addUserPrjRef$: Observable<Action> = this.actions$.pipe(
  //   ofType<actions.AddProjectSuccessAction>(actions.ProjectActionTypes.ADD_SUCCESS),
  //   map(action => action.payload),
  //   map((prj: Project) => prj.id),
  //   withLatestFrom(
  //     this.store$.pipe(
  //       select(fromRoot.getAuth),
  //       map(auth => auth.user)
  //     ),
  //     (projectId: string, user: User) => {
  //       return new userActions.AddUserProjectAction({
  //         user: user,
  //         projectId: projectId
  //       });
  //     }
  //   )
  // );

  // @Effect()
  // delUserPrjRef$: Observable<Action> = this.actions$.pipe(
  //   ofType<actions.DeleteProjectSuccessAction>(actions.ProjectActionTypes.DELETE_SUCCESS),
  //   map(action => action.payload),
  //   map((prj: Project) => prj.id),
  //   withLatestFrom(
  //     this.store$.pipe(
  //       select(fromRoot.getAuth),
  //       map(auth => auth.user)
  //     ),
  //     (projectId: string, user: User) => {
  //       return new userActions.RemoveUserProjectAction({
  //         user: user,
  //         projectId: projectId
  //       });
  //     }
  //   )
  // );

  @Effect()
  invite$: Observable<Action> = this.actions$.pipe(
    ofType<actions.InviteAction>(actions.ProjectActionTypes.INVITE),
    map(action => action.payload),
    switchMap(({ projectId, members }) =>
      this.service.inviteMembers(projectId, members).pipe(
        map(
          (project: Project) => new actions.InviteSuccessAction(project)
        ),
        catchError(err => of(new actions.InviteFailAction(err)))
      )
    )
  );

  // @Effect()
  // updateUserPrjRef$: Observable<Action> = this.actions$.pipe(
  //   ofType<actions.InviteSuccessAction>(actions.ProjectActionTypes.INVITE_SUCCESS),
  //   map(action => action.payload),
  //   map(
  //     (project: Project) =>
  //       new userActions.BatchUpdateUserProjectAction(project)
  //   )
  // );

  // @Effect({ dispatch: false })
  // navigate$ = this.actions$.pipe(
  //   ofType(routerActions.GO),
  //   map((action: routerActions.Go) => action.payload),
  //   tap(({ path, query: queryParams, extras }) =>
  //     this.router.navigate(path, { queryParams, ...extras })
  //   )
  // );

  /**
   *
   * @param actions$ action 流
   * @param service  注入 ProjectService
   * @param store$ 注入 redux store
   */
  constructor(
    private actions$: Actions,
    private service: ProjectService,
    private router: Router,
    private store$: Store<fromRoot.State>
  ) { }
}
