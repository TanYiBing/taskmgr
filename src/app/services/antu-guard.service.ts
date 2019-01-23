import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import * as routerActions from '../actions/router.action';
import { map, defaultIfEmpty } from 'rxjs/operators';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private store$: Store<fromRoot.State>
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store$.select(fromRoot.getAuthState).pipe(
      map(auth => {
        const result = auth.token !== undefined && auth.token !== null;
        if (!result) {
          this.store$.dispatch(new routerActions.Go({ path: ['/login'] }));
        }
        return result;
      }),
      // 如果为空默认为false
      defaultIfEmpty(false)
    );
  }
}
