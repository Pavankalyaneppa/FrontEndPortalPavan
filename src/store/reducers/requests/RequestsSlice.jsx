import { createSlice } from '@reduxjs/toolkit';
import AxiosServices from '@/services/AxiosServices';

const initialState = {
  list: [],
  status: 'idle',
  error: null,
  totalElements: 0,
  currentPage: 0,
};

const RequestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    fetchRequestsStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    fetchRequestsSuccess: (state, action) => {
    state.status = 'succeeded';
    state.list = action.payload || [];
    state.totalElements = state.list.length;
    state.currentPage = 0;
    },
    fetchRequestsFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    addRequestSuccess: (state, action) => {
      state.list.push(action.payload);
      state.totalElements += 1;
    },
  },
});

// Existing thunk to create a new request
export const createRequest = (requestData) => async (dispatch) => {
  try {
    const savedRequest = await AxiosServices.requestFranchise(requestData);
    if (savedRequest?.id) {
      dispatch(addRequestSuccess(savedRequest));
    }
    return savedRequest;
  } catch (error) {
    dispatch(fetchRequestsFailure(error.message || "Failed to create request"));
    throw error;
  }
};

// Thunk to fetch franchise requests (existing)
export const fetchRequestedData = (params = {}) => async (dispatch) => {
  dispatch(fetchRequestsStart());
  try {
    const data = await AxiosServices.getRequestedFranchises(params);
    dispatch(fetchRequestsSuccess(data));
  } catch (error) {
    dispatch(fetchRequestsFailure(error.message || error));
  }
};

export const fetchRequestedDataDb = (params = {}) => async (dispatch) => {
  dispatch(fetchRequestsStart());
  try {
    const response = await AxiosServices.getRequestedFranchisesList(params);
    console.log('API Response:', response); // Debug log
    dispatch(fetchRequestsSuccess(response));
  } catch (error) {
    console.error('Error fetching requests:', error);
    dispatch(fetchRequestsFailure(error.message || error));
  }
};

export const {
  fetchRequestsStart,
  fetchRequestsSuccess,
  fetchRequestsFailure,
  addRequestSuccess,
} = RequestSlice.actions;

export default RequestSlice.reducer;
