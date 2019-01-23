import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as authActions from '../actions/auth.action';
import * as routerActions from '../actions/router.action';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { User } from '../domain';
import { Router } from '../../../node_modules/@angular/router';

@Injectable()
export class AuthEffects {
  @Effect()
  login$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.LOGIN),
    map((action: authActions.LoginAction) => action.payload),
    switchMap((val: { email: string; password: string }) => this.authService$.login(val.email, val.password).pipe(
      map(auth => new authActions.LoginSuccessAction(auth)),
      catchError(err => of(new authActions.LoginFailAction(JSON.stringify(err)))),
    ))
  );

  @Effect()
  register$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.REGISTER),
    map((action: authActions.LoginAction) => action.payload),
    switchMap((user: User) => this.authService$.register(user).pipe(
      map(auth => new authActions.RegisterSuccessAction(auth)),
      catchError(err => of(new authActions.RegisterFailAction(JSON.stringify(err))))
    ))
  );

  @Effect()
  logout$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.LOGOUT),
    map(_ => new routerActions.Go({ path: ['/'] }))
  );

  @Effect()
  loginAndNavigate$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.LOGIN_SUCCESS),
    map(_ => new routerActions.Go({ path: ['/project'] }))
  );

  @Effect()
  registerAndNavigate$: Observable<Action> = this.actions$.pipe(
    ofType(authActions.AuthActionTypes.REGISTER_SUCCESS),
    map(_ => new routerActions.Go({ path: ['/project'] }))
  );

  @Effect({ dispatch: false })
  navigate$ = this.actions$.pipe(
    ofType(routerActions.RouterActionTypes.GO),
    map((action: routerActions.Go) => action.payload),
    tap(({ path, query: queryParams, extras }) =>
      this.router.navigate(path, { queryParams, ...extras })
    )
  );


  constructor(
    private actions$: Actions,
    private authService$: AuthService,
    private router: Router
  ) { }
}
