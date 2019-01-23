import { NgModule } from '@angular/core';
import { StoreModule, ActionReducerMap, MetaReducer, createFeatureSelector } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';

import * as fromQuote from './quote.reducer';
import * as fromAuth from './auth.reducer';
import * as fromRouter from '@ngrx/router-store';

import { Quote, Auth } from '../domain';
import { RouterStateUrl } from '../utils/router.util';

export interface State {
  quote: Quote;
  auth: Auth;
  router: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<State> = {
  quote: fromQuote.reducer,
  auth: fromAuth.reducer,
  router: fromRouter.routerReducer
};

export const getQuoteState = createFeatureSelector<Quote>('quote');
export const getAuthState = createFeatureSelector<Auth>('auth');

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

