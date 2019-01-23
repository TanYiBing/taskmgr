import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import * as actions from '../actions/quote.action';
import { switchMap, map, catchError } from 'rxjs/operators';
import { QuoteService } from '../services/quote.service';

@Injectable()
export class QuoteEffects {
  @Effect()
  quote$: Observable<Action> = this.actions$.pipe(
      ofType(actions.QuoteActionTypes.QUOTE),
      switchMap(() => this.quoteService$.getQuote().pipe(
        map(q => new actions.QuoteSuccessAction(q)),
        catchError(err => of(new actions.QuoteFailAction(JSON.stringify(err))))
      ))
  );

  constructor(
    private actions$: Actions,
    private quoteService$: QuoteService
  ) {}
}
