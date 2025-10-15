// import { createSlice } from "@reduxjs/toolkit";
// import AxiosServices from "@/services/AxiosServices";

// // Initialize from localStorage
// const storedToken = localStorage.getItem('authToken');
// const storedId = localStorage.getItem('id');
// const storedOrgId = localStorage.getItem('orgId');
// const storedRoleId = localStorage.getItem('roleId');
// const storedDesignation = localStorage.getItem('designation');

// const initialState = {
//   auth: { loading: false, text: 'logging' },
//   isAuthenticated: Boolean(storedToken),
//   registerStatus: 'idle',
//   registerError: null,
//   loginLoading: false,
//   loginText: "",
//   loginNotification: false,
//   user: {
//     id: storedId || null,
//     orgId: storedOrgId || null,
//     token: storedToken || null,
//     roleId: storedRoleId || null,
//     designation: storedDesignation || null,
//   },
// };

// export const authenticationSlice = createSlice({
//   name: 'authentication',
//   initialState,
//   reducers: {
//     loginUserStart: (state) => {
//       state.loginLoading = true;
//     },
//     loginUserSuccess: (state, action) => {
//       state.loginLoading = false;
//       state.user = {
//         id: action.payload.id,
//         orgId: action.payload.orgId,
//         token: action.payload.token,
//         // roleId: action.payload.usersinroles?.[0]?.role_id || null,
//         //here i added designation field specifically for employee login
//         roleId: action.payload.usersinroles?.[0]?.role_id || action.payload.roleId || null,
//         designation: action.payload.designation || null,
//       };
//       state.isAuthenticated = true;
//     },
//     loginUserFailure: (state, action) => {
//       state.loginLoading = false;
//       state.loginText = action.payload;
//       state.loginNotification = true;
//     },
//     logoutUser: (state) => {
//       state.isAuthenticated = false;
//       state.user = {
//         id: null,
//         orgId: null,
//         token: null,
//         roleId: null,
//       };
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('orgId');
//       localStorage.removeItem('id');
//       localStorage.removeItem('roleId');
//     },
//     stopNotification: (state) => {
//       state.loginNotification = false;
//     },
//     registerUserStart: (state) => {
//       state.registerStatus = 'loading';
//       state.auth.loading = true;
//     },
//     registerUserSuccess: (state) => {
//       state.registerStatus = 'succeeded';
//       state.auth.loading = false;
//     },
//     registerUserFailure: (state, action) => {
//       state.registerStatus = 'failed';
//       state.registerError = action.payload;
//       state.auth.loading = false;
//     },
//   },
// });

// export const {
//   loginUserStart,
//   loginUserSuccess,
//   loginUserFailure,
//   logoutUser,
//   registerUserStart,
//   registerUserSuccess,
//   registerUserFailure,
//   stopNotification,
// } = authenticationSlice.actions;

// // Thunk to register user
// export const registerUser = (userData) => async (dispatch) => {
//   try {
//     dispatch(registerUserStart());
//     await AxiosServices.registerUser(userData);
//     dispatch(registerUserSuccess());
//   } catch (error) {
//     dispatch(registerUserFailure("Unable to Register: " + (error.response?.data?.message || error.message)));
//   }
// };

// // Thunk to login user
// export const loginDispatcher = (userData) => async (dispatch) => {
//   try {
//     dispatch(loginUserStart());
//     const response = await AxiosServices.loginUser(userData);
//     const data = response.data;

//     console.log(response);

//     // if (!response.data?.usersinroles?.[0]?.role_id) {
//     //   throw new Error("No role assigned to this user");
//     // }

//     // Detect roleId from usersinroles (direct login) or roleId (employee login)
//     const roleId = data.usersinroles?.[0]?.role_id || data.roleId || null;

//     if (!roleId) {
//       throw new Error("No role assigned to this user");
//     }

//     // Save to localStorage

//     localStorage.setItem("authToken", data.token);
//     localStorage.setItem("orgId", data.orgId || "");
//     localStorage.setItem("id", data.id);
//     localStorage.setItem("roleId", roleId);

//     // Optional: save designation only for employees
//     if (data.designation) {
//       localStorage.setItem("designation", data.designation);
//     } else {
//       localStorage.removeItem("designation");
//     }

//     dispatch(loginUserSuccess({ ...data, roleId }));
//   } catch (error) {
//     const errorMessage = error.response?.data?.message || error.message;
//     dispatch(loginUserFailure("Unable to Login: " + errorMessage));
//   }
// };
//     // localStorage.setItem("authToken", response.data.token);
//     // localStorage.setItem("orgId", response.data.orgId);
//     // localStorage.setItem("id", response.data.id);
//     // localStorage.setItem("roleId", response.data.usersinroles[0].role_id);
// //     dispatch(loginUserSuccess(response.data));
// //   } catch (error) {
// //     const errorMessage = error.response?.data?.message || error.message;
// //     dispatch(loginUserFailure("Unable to Login: " + errorMessage));
// //   }
// // };

// export default authenticationSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";
import AxiosServices from "@/services/AxiosServices";

// Initialize from localStorage
const storedToken = localStorage.getItem('authToken');
const storedId = localStorage.getItem('id');
const storedOrgId = localStorage.getItem('orgId');
const storedRoleId = localStorage.getItem('roleId');
const storedDesignation = localStorage.getItem('designation');

const initialState = {
  auth: { loading: false, text: 'logging' },
  isAuthenticated: Boolean(storedToken),
  registerStatus: 'idle',
  registerError: null,
  loginLoading: false,
  loginText: "",
  loginNotification: false,
  user: {
    id: storedId || null,
    orgId: storedOrgId || null,
    token: storedToken || null,
    roleId: storedRoleId || null,
    designation: storedDesignation || null,
  },
};

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    loginUserStart: (state) => {
      state.loginLoading = true;
    },
    loginUserSuccess: (state, action) => {
      state.loginLoading = false;
      state.user = {
        id: action.payload.id,
        orgId: action.payload.orgId,
        token: action.payload.token,
        //here i added designation field specifically for employee login
        roleId: action.payload.usersinroles?.[0]?.role_id || action.payload.roleId || null,
        designation: action.payload.designation || null,
      };
      state.isAuthenticated = true;
    },
    loginUserFailure: (state, action) => {
      state.loginLoading = false;
      state.loginText = action.payload;
      state.loginNotification = true;
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = {
        id: null,
        orgId: null,
        token: null,
        roleId: null,
      };
      localStorage.removeItem('authToken');
      localStorage.removeItem('orgId');
      localStorage.removeItem('id');
      localStorage.removeItem('roleId');
    },
    stopNotification: (state) => {
      state.loginNotification = false;
    },
    registerUserStart: (state) => {
      state.registerStatus = 'loading';
      state.auth.loading = true;
    },
    registerUserSuccess: (state) => {
      state.registerStatus = 'succeeded';
      state.auth.loading = false;
    },
    registerUserFailure: (state, action) => {
      state.registerStatus = 'failed';
      state.registerError = action.payload;
      state.auth.loading = false;
    },
  },
});

export const {
  loginUserStart,
  loginUserSuccess,
  loginUserFailure,
  logoutUser,
  registerUserStart,
  registerUserSuccess,
  registerUserFailure,
  stopNotification,
} = authenticationSlice.actions;

// Thunk to register user
export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(registerUserStart());
    await AxiosServices.registerUser(userData);
    dispatch(registerUserSuccess());
  } catch (error) {
    dispatch(registerUserFailure("Unable to Register: " + (error.response?.data?.message || error.message)));
  }
};

// Thunk to login user
export const loginDispatcher = (userData) => async (dispatch) => {
  try {
    dispatch(loginUserStart());

    const response = await AxiosServices.loginUser(userData);
    const data = response.data;

    // Detect roleId from usersinroles (direct login) or roleId (employee login)
    const roleId = data.usersinroles?.[0]?.role_id || data.roleId || null;

    if (!roleId) {
      throw new Error("No role assigned to this user");
    }
    // Save to localStorage
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("orgId", data.orgId || "");
    localStorage.setItem("id", data.id);
    localStorage.setItem("roleId", roleId);

    // Optional: save designation only for employees
    if (data.designation) {
      localStorage.setItem("designation", data.designation);
    } else {
      localStorage.removeItem("designation");
    }

    dispatch(loginUserSuccess({ ...data, roleId }));
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    dispatch(loginUserFailure("Unable to Login: " + errorMessage));
  }
};

export default authenticationSlice.reducer;
//added by sukanya