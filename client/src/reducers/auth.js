import {
  USER_LOAD,
  USER_AUTH_ERROR,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_ACTIVATE_SUCCESS,
  USER_ACTIVATE_FAIL,
  USER_RESEND_EMAIL_SUCCESS,
  USER_RESEND_EMAIL_FAIL,
} from "../actions/types";

const initialState = {
  isAuthenticated: false,
  loading: true,
  user: null,
};

const authReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case USER_LOAD:
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case USER_REGISTER_SUCCESS:
    case USER_ACTIVATE_SUCCESS:
    case USER_RESEND_EMAIL_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case USER_LOGIN_FAIL:
    case USER_REGISTER_FAIL:
    case USER_AUTH_ERROR:
    case USER_LOGOUT:
    case USER_ACTIVATE_FAIL:
    case USER_RESEND_EMAIL_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;
