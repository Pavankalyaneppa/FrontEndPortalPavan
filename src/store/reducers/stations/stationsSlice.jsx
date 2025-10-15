import { createSlice } from '@reduxjs/toolkit';
import AxiosServices from '@/services/AxiosServices';

const initialState = {
  list: [],
  status: 'idle',
  error: null,
  currentStation: null,
  totalElements: 0,
  currentPage: 0,
};

function parseStationsPayload(payload) {
  // Accepts the payload and normalizes it to our state shape
  console.log(payload);
  let list = [];
  let totalElements = 0;
  let currentPage = 0;
  let totalPages=0;
  // Check various possible shapes
  if (payload) {
    if (Array.isArray(payload.sites)) {
      list = payload.sites;
    } else if (Array.isArray(payload.stations)) {
      list = payload.stations;
    } else if (Array.isArray(payload.content)) {
      list = payload.content;
    } else if (Array.isArray(payload)) {
      list = payload;
    } else if (payload.data) {
      // Some APIs wrap in .data
      list = payload.data;
    }
  }
     // totalElements or totalItems or totalPages*size fallback
    totalElements =payload.totalItems;
    totalPages=payload.totalPages;

    currentPage = payload.currentPage ?? payload.page ?? 0;
  

  return { list, totalElements, currentPage,totalPages };
}

const stationsSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    getStationsStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    getStationsSuccess: (state, action) => {
      state.status = 'succeeded';
      const { list, totalElements, currentPage,totalPages } = parseStationsPayload(action.payload);
      state.list = list;
      state.totalElements = totalElements;
      state.currentPage = currentPage;
      state.totalPages=totalPages;
    },
    getStationsFailure: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    getStationDetailsSuccess: (state, action) => {
      state.currentStation = action.payload;
    },
  },
});

export const {
  getStationsStart,
  getStationsSuccess,
  getStationsFailure,
  getStationDetailsSuccess,
} = stationsSlice.actions;

// Thunk action creators
export const fetchStations = (params) => async (dispatch) => {
  try {
    dispatch(getStationsStart());
    const response = await AxiosServices.getStations(params);
    console.log(response);
    dispatch(getStationsSuccess(response));
  } catch (error) {
    dispatch(getStationsFailure(error.message));
  }
};

export const fetchStationByFilters = (stationName, stationStatus, currentType, page = 0, size = 10) => async (dispatch) => {
  try {
    dispatch(getStationsStart());
    const response = await AxiosServices.getStationsByFilters(stationName, stationStatus, currentType, page, size);
    dispatch(getStationsSuccess(response.data ?? response));
  } catch (error) {
    dispatch(getStationsFailure(error.message));
  }
};
export const searchStations = ({ search = '', page = 0, size = 10, searchField = '' }) => async (dispatch) => {
  try {
    dispatch(getStationsStart());
    const response = await AxiosServices.searchStations({ search, page, size, searchField });
    dispatch(getStationsSuccess(response.data ?? response));
  } catch (error) {
    dispatch(getStationsFailure(error.message || 'Search failed'));
  }
};

// export const searchStations = ({ siteName = '', stationStatus = '', currentType = '', page = 0, size = 10 }) => async (dispatch) => {
//   try {
//     dispatch(getStationsStart());
//     const response = await AxiosServices.searchStations({ siteName, stationStatus, currentType, page, size });
//     dispatch(getStationsSuccess(response));
//   } catch (error) {
//     dispatch(getStationsFailure(error.message || 'Search failed'));
//   }
// };

export const fetchStationDetails = (id) => async (dispatch) => {
  try {
    const response = await AxiosServices.getStationDetails(id);
    dispatch(getStationDetailsSuccess(response.data));
  } catch (error) {
    console.error('Error fetching station details:', error);
  }
};

export default stationsSlice.reducer;