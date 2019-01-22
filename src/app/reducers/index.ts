import { NgModule } from '@angular/core';
import { StoreModule, ActionReducerMap, MetaReducer, createFeatureSelector } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';

import * as fromQuote from './quote.reducer';
import { Quote } from '../domain';

export interface State {
  quote: Quote;
}

export const reducers: ActionReducerMap<State> = {
  quote: fromQuote.reducer,
};

export const getQuoteState = createFeatureSelector('quote');

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

