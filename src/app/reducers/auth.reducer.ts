import { Auth } from '../domain';
import * as authActions from '../actions/auth.action';

const initialState: Auth = {};

export function reducer(state = initialState, action: authActions.AuthActions ): Auth {
  switch (action.type) {
    case authActions.AuthActionTypes.LOGIN_SUCCESS:
    case authActions.AuthActionTypes.REGISTER_SUCCESS: {
      return {...action.payload};
    }

    case authActions.AuthActionTypes.LOGIN_FAIL:
    case authActions.AuthActionTypes.REGISTER_FAIL: {
      return state;
    }

    default: {
      return state;
    }
  }
}
