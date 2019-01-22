import * as quoteActions from '../actions/quote.action';
import { Quote } from '../domain';

export const initialState: Quote = {
  cn: '满足感在于不断的努力，而不是现有成就。全心努力定会胜利满满。',
  en: 'Satisfaction lies in the effort, not in the attainment. Full efforts is full victory.',
  pic: 'assets/img/quotes/0.jpg'
};

export function reducer(state: Quote = initialState, action: quoteActions.QuoteActions): Quote {
  switch (action.type) {
    case quoteActions.QuoteActionTypes.QUOTE_SUCCESS: {
      return { ...action.payload };
    }
    case quoteActions.QuoteActionTypes.QUOTE_FAIL: {
      return state;
    }

    default: {
      return state;
    }
  }
}
