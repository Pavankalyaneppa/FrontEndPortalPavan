import { createSlice } from '@reduxjs/toolkit';
import AxiosServices from '@/services/AxiosServices';

const initialState = {
  stations: [],
  status: 'idle',
  error: null,
  requestStatus: 'idle',
  requestError: null,
  requestResponse: null,
};

const ocppSlice = createSlice({
  name: 'ocpp',
  initialState,
  reducers: {
    getStationsStart: (state) => {
      state.status = 'loading';
    },
    getStationsSuccess: (state, action) => {
      state.status = 'succeeded';
      state.stations = action.payload;
    },
    getStationsFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    sendRequestStart: (state) => {
      state.requestStatus = 'loading';
    },
    sendRequestSuccess: (state, action) => {
      state.requestStatus = 'succeeded';
      state.requestResponse = action.payload;
    },
    sendRequestFailure: (state, action) => {
      state.requestStatus = 'failed';
      state.requestError = action.payload;
    },
    clearRequestResponse: (state) => {
      state.requestStatus = 'idle';
      state.requestResponse = null;
      state.requestError = null;
    },
  },
});

export const {
  getStationsStart,
  getStationsSuccess,
  getStationsFailure,
  sendRequestStart,
  sendRequestSuccess,
  sendRequestFailure,
  clearRequestResponse,
} = ocppSlice.actions;

export const fetchOcppStations = () => async (dispatch) => {
  try {
    dispatch(getStationsStart());
    const response = await AxiosServices.getOcppStations();
    dispatch(getStationsSuccess(response));
  } catch (error) {
    dispatch(getStationsFailure(error.message));
  }
};

export const sendOcppRequest = (data) => async (dispatch) => {
  try {
    dispatch(sendRequestStart());
    const response = await AxiosServices.sendOcppRequest(data);
    dispatch(sendRequestSuccess(response));
  } catch (error) {
    dispatch(sendRequestFailure(error.message));
  }
};

export default ocppSlice.reducer;