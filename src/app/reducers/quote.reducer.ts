import * as quoteActions from '../actions/quote.action';
import { Quote } from '../domain';

export interface State {
  quote: Quote;
}

export const initialState: State = {
  quote: {
    cn: '满足感在于不断的努力，而不是现有成就。全心努力定会胜利满满。',
    en: 'Satisfaction lies in the effort, not in the attainment. Full efforts is full victory.',
    pic: 'assets/img/quotes/0.jpg'
  }
};

export function reducer(state = initialState, action: quoteActions.QuoteActions ): State {
  switch (action.type) {
    case quoteActions.QuoteActionTypes.QUOTE_SUCCESS: {
      return {...state, quote: <Quote>action.payload};
    }
    case quoteActions.QuoteActionTypes.QUOTE_FAIL: {
      return state;
    }

    default: {
      return state;
    }
  }
}

export const getQuote = (state: State) => state.quote;
