import { NgModule } from '@angular/core';
import { StoreModule, ActionReducerMap, MetaReducer, createFeatureSelector, createSelector } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';

import * as fromQuote from './quote.reducer';
import * as fromAuth from './auth.reducer';
import * as fromProject from './project.reducer';
import * as fromRouter from '@ngrx/router-store';

import { Quote, Auth } from '../domain';
import { RouterStateUrl } from '../utils/router.util';

export interface State {
  quote: Quote;
  auth: Auth;
  router: fromRouter.RouterReducerState<RouterStateUrl>;
  project: fromProject.State;
}

export const reducers: ActionReducerMap<State> = {
  quote: fromQuote.reducer,
  auth: fromAuth.reducer,
  router: fromRouter.routerReducer,
  project: fromProject.reducer
};

export const getQuoteState = createFeatureSelector<Quote>('quote');
export const getAuthState = createFeatureSelector<Auth>('auth');
export const getProjectsState = createFeatureSelector<fromProject.State>('project');

export const {
  selectIds: getProjectIds,
  selectEntities: getProjectEntities,
  selectAll: getProjects,
  selectTotal: getProjectTotal
} = fromProject.adapter.getSelectors(getProjectsState);


export const getAuth = createSelector(getAuthState, getUserEntities, (_auth, _entities) => {
  return { ..._auth, user: _entities[<string>_auth.userId] };
});

export const metaReducers: MetaReducer<State>[] = !environment.production ? [storeFreeze] : [];
@NgModule({
  imports: [
    /**
     * StoreModule.forRoot  仅需引入一次，请把它包含在根模块或者 CoreModule 中
     * 我们这里为了方便组织，新建了一个 AppStoreModule，但也是只在 CoreModule 中引入的
     */
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreRouterConnectingModule.forRoot(),
    // DevTool 需要在 StoreModule 之后导入
    environment.production ? [] : StoreDevtoolsModule.instrument({ maxAge: 50 })
  ]
})
export class AppStoreModule {}

