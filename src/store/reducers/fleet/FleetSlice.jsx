
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosServices from '@/services/AxiosServices';



const initialState = {
  fleets: [],
  currentFleet: null,
  fleetVehicles: [],
  currentVehicle: null,
  status: 'idle',
  error: null,
  fleetDetailsStatus: 'idle',
  fleetDetailsError: null,
  addFleetStatus: 'idle',
  addFleetError: null,
  updateFleetStatus: 'idle',
  updateFleetError: null,
  deleteFleetStatus: 'idle',
  deleteFleetError: null,
  addVehicleStatus: 'idle',
  addVehicleError: null,
  updateVehicleStatus: 'idle',
  updateVehicleError: null,
  deleteVehicleStatus: 'idle',
  deleteVehicleError: null,
};

export const fetchFleets = createAsyncThunk(
  'fleet/fetchFleets',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await AxiosServices.getAllFleets(params); 
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch fleets');
    }
  }
);

export const fetchFleetDetails = createAsyncThunk(
  'fleet/fetchFleetDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await AxiosServices.getFleetDetails(id); 
      console.log("from slice", response);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch fleet details');
    }
  }
);



export const fetchFleetVehicles = createAsyncThunk(
  'fleet/fetchFleetVehicles',
  async (fleetId, { rejectWithValue }) => {
    try {
      const response = await AxiosServices.getFleetVehicles(fleetId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch fleet vehicles');
    }
  }
);

export const addFleet = createAsyncThunk(
  'fleet/addFleet',
  async (fleetData, { rejectWithValue }) => {
    try {
      const response = await AxiosServices.addFleet(fleetData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add fleet');
    }
  }
);

export const updateFleet = createAsyncThunk(
  'fleet/updateFleet',
  async ({ id, fleetData }, { rejectWithValue }) => {
    try {
      const response = await AxiosServices.updateFleet(id, fleetData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update fleet');
    }
  }
);

export const deleteFleet = createAsyncThunk(
  'fleet/deleteFleet',
  async (id, { rejectWithValue }) => {
    try {
      await AxiosServices.deleteFleet(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete fleet');
    }
  }
);


export const addVehicleToFleet = createAsyncThunk(
  'fleet/addVehicleToFleet',
  async ({ fleetId, vehicleForm }, { rejectWithValue }) => {
    try {
      const response = await AxiosServices.addVehicleToFleet(fleetId, vehicleForm);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add vehicle');
    }
  }
);


export const fetchVehicleDetails = createAsyncThunk(
  'fleet/fetchVehicleDetails',
  async (vehicleId, { rejectWithValue }) => {
    try {
      const response = await AxiosServices.getVehicleDetails(vehicleId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch vehicle details');
    }
  }
);

export const updateVehicle = createAsyncThunk(
  'fleet/updateVehicle',
  async ({ vehicleId, vehicleData }, { rejectWithValue }) => {
    try {
      const response = await AxiosServices.updateVehicle(vehicleId, vehicleData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update vehicle');
    }
  }
);

export const deleteVehicleFromFleet = createAsyncThunk(
  'fleet/deleteVehicleFromFleet',
  async ({ fleetId, vehicleId }, { rejectWithValue }) => {
    try {
      await AxiosServices.deleteVehicleFromFleet(fleetId, vehicleId);
      return { fleetId, vehicleId };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete vehicle');
    }
  }
);


const fleetSlice = createSlice({
  name: 'fleet',
  initialState,
  reducers: {
    resetFleetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
    resetAddFleetStatus: (state) => {
      state.addFleetStatus = 'idle';
      state.addFleetError = null;
    },
    resetFleetDetails: (state) => {
      state.currentFleet = null;
      state.fleetDetailsStatus = 'idle';
      state.fleetDetailsError = null;
    },
    resetVehicleStatus: (state) => {
      state.addVehicleStatus = 'idle';
      state.addVehicleError = null;
      state.updateVehicleStatus = 'idle';
      state.updateVehicleError = null;
      state.deleteVehicleStatus = 'idle';
      state.deleteVehicleError = null;
    },
    clearFleets: (state) => {
      state.fleets = [];
    },
    clearFleetVehicles: (state) => {
      state.fleetVehicles = [];
    },
    setCurrentFleet: (state, action) => {
      state.currentFleet = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch fleets
      .addCase(fetchFleets.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFleets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.fleets = Array.isArray(action.payload) ? action.payload : action.payload.content || [];
      })
      .addCase(fetchFleets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.fleets = [];
      })
      
      // Fetch fleet details
      .addCase(fetchFleetDetails.pending, (state) => {
        state.fleetDetailsStatus = 'loading';
        state.fleetDetailsError = null;
        state.currentFleet = null;
      })
      .addCase(fetchFleetDetails.fulfilled, (state, action) => {
        state.fleetDetailsStatus = 'succeeded';
        state.currentFleet = action.payload;
      })
      .addCase(fetchFleetDetails.rejected, (state, action) => {
        state.fleetDetailsStatus = 'failed';
        state.fleetDetailsError = action.payload;
        state.currentFleet = null;
      })
      
      // Fetch fleet vehicles
      .addCase(fetchFleetVehicles.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFleetVehicles.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (Array.isArray(action.payload)) {
          state.fleetVehicles = action.payload;
        } else if (action.payload && Array.isArray(action.payload.content)) {
          state.fleetVehicles = action.payload.content;
        } else if (action.payload && action.payload.data && Array.isArray(action.payload.data)) {
          state.fleetVehicles = action.payload.data;
        } else {
          console.error('Unexpected payload format in fetchFleetVehicles:', action.payload);
          state.fleetVehicles = [];
        }
      })
      .addCase(fetchFleetVehicles.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.fleetVehicles = [];
      })
      
      // Add fleet
      .addCase(addFleet.pending, (state) => {
        state.addFleetStatus = 'loading';
        state.addFleetError = null;
      })
      .addCase(addFleet.fulfilled, (state, action) => {
        state.addFleetStatus = 'succeeded';
        state.fleets.push(action.payload);
      })
      .addCase(addFleet.rejected, (state, action) => {
        state.addFleetStatus = 'failed';
        state.addFleetError = action.payload;
      })
      
      // Update fleet
      .addCase(updateFleet.pending, (state) => {
        state.updateFleetStatus = 'loading';
        state.updateFleetError = null;
      })
      .addCase(updateFleet.fulfilled, (state, action) => {
        state.updateFleetStatus = 'succeeded';
        const index = state.fleets.findIndex(fleet => fleet.id === action.payload.id);
        if (index !== -1) {
          state.fleets[index] = action.payload;
        }
        if (state.currentFleet && state.currentFleet.id === action.payload.id) {
          state.currentFleet = action.payload;
        }
      })
      .addCase(updateFleet.rejected, (state, action) => {
        state.updateFleetStatus = 'failed';
        state.updateFleetError = action.payload;
      })
      
      // Delete fleet
      .addCase(deleteFleet.pending, (state) => {
        state.deleteFleetStatus = 'loading';
        state.deleteFleetError = null;
      })
      .addCase(deleteFleet.fulfilled, (state, action) => {
        state.deleteFleetStatus = 'succeeded';
        state.fleets = state.fleets.filter(fleet => fleet.id !== action.payload);
      })
      .addCase(deleteFleet.rejected, (state, action) => {
        state.deleteFleetStatus = 'failed';
        state.deleteFleetError = action.payload;
      })
      
      // Add vehicle to fleet
      .addCase(addVehicleToFleet.pending, (state) => {
        state.addVehicleStatus = 'loading';
        state.addVehicleError = null;
      })
      .addCase(addVehicleToFleet.fulfilled, (state, action) => {
        state.addVehicleStatus = 'succeeded';
        state.fleetVehicles.push(action.payload);
      })
      .addCase(addVehicleToFleet.rejected, (state, action) => {
        state.addVehicleStatus = 'failed';
        state.addVehicleError = action.payload;
      })
      
      // Fetch vehicle details
      .addCase(fetchVehicleDetails.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchVehicleDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentVehicle = action.payload;
      })
      .addCase(fetchVehicleDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.currentVehicle = null;
      })
      
      // Update vehicle
      .addCase(updateVehicle.pending, (state) => {
        state.updateVehicleStatus = 'loading';
        state.updateVehicleError = null;
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.updateVehicleStatus = 'succeeded';
        const index = state.fleetVehicles.findIndex(vehicle => vehicle.id === action.payload.id);
        if (index !== -1) {
          state.fleetVehicles[index] = action.payload;
        }
        if (state.currentVehicle && state.currentVehicle.id === action.payload.id) {
          state.currentVehicle = action.payload;
        }
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.updateVehicleStatus = 'failed';
        state.updateVehicleError = action.payload;
      })
      
      // Delete vehicle from fleet
      .addCase(deleteVehicleFromFleet.pending, (state) => {
        state.deleteVehicleStatus = 'loading';
        state.deleteVehicleError = null;
      })
      .addCase(deleteVehicleFromFleet.fulfilled, (state, action) => {
        state.deleteVehicleStatus = 'succeeded';
        state.fleetVehicles = state.fleetVehicles.filter(
          vehicle => vehicle.id !== action.payload.vehicleId
        );
      })
      .addCase(deleteVehicleFromFleet.rejected, (state, action) => {
        state.deleteVehicleStatus = 'failed';
        state.deleteVehicleError = action.payload;
      });
  },
});

export const {
  resetFleetStatus,
  resetAddFleetStatus,
  resetFleetDetails,
  resetVehicleStatus,
  clearFleets,
  clearFleetVehicles,
  setCurrentFleet,
} = fleetSlice.actions;

export default fleetSlice.reducer;