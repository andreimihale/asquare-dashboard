import axios from "axios";
import setAlert from "./alert";
import {
  USER_LOAD,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_AUTH_ERROR,
  USER_LOGOUT,
  USER_ACTIVATE_FAIL,
  USER_ACTIVATE_SUCCESS,
  USER_RESEND_EMAIL_SUCCESS,
  USER_RESEND_EMAIL_FAIL,
} from "./types";

export const loadUser = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/auth/user/load");

    dispatch({
      type: USER_LOAD,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: USER_AUTH_ERROR,
    });
  }
};

export const registerUser =
  ({
    firstName,
    lastName,
    middleName = null,
    alias = null,
    email,
    password,
    phones = null,
    avatar = null,
  }) =>
  async (dispatch) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify({
        firstName,
        lastName,
        middleName,
        alias,
        email,
        password,
        phones,
        avatar,
      });

      const res = await axios.post("/api/auth/register", body, config);

      dispatch({
        type: USER_REGISTER_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      const {
        response: { data },
      } = error;

      if (data) {
        dispatch(setAlert(data, "danger"));
      }

      dispatch({ type: USER_REGISTER_FAIL });
    }
  };

export const loginUser =
  ({ email, password }) =>
  async (dispatch) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify({ email, password });

      const res = await axios.post("/api/auth/user/login", body, config);

      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      const {
        response: { data },
      } = error;

      if (data) {
        dispatch(setAlert(data, "danger"));
      }

      dispatch({ type: USER_LOGIN_FAIL });
    }
  };

export const logoutUser = () => async (dispatch) => {
  try {
    await axios.get("/api/auth/user/logout");
    dispatch({
      type: USER_LOGOUT,
    });
  } catch (error) {
    dispatch({
      type: USER_AUTH_ERROR,
    });
  }
};

export const activateUser = (token) => async (dispatch) => {
  try {
    await axios.get(`/api/auth/user/activate/${token}`);

    dispatch({
      type: USER_ACTIVATE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: USER_ACTIVATE_FAIL,
    });
  }
};

export const resendEmailUser =
  ({ email }) =>
  async (dispatch) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({ email });
      await axios.post("/api/auth/user/resendemail", body, config);

      dispatch({
        type: USER_RESEND_EMAIL_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: USER_RESEND_EMAIL_FAIL,
      });
    }
  };

// export const changePasswordUser = () => async (dispatch) => {};

// export const forgotPasswordUser = () => async (dispatch) => {};

// export const resetPasswordUser = () => async (dispatch) => {};
