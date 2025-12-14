import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchUserBookings = createAsyncThunk('booking/fetchUserBookings', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/bookings/user');
    return response.data.bookings;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
  }
});

export const fetchAvailability = createAsyncThunk('booking/fetchAvailability', async ({ date, mentorId }, { rejectWithValue }) => {
  try {
    const response = await api.get('/bookings/availability', { params: { date, mentorId } });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch availability');
  }
});

export const createBooking = createAsyncThunk('booking/createBooking', async (bookingData, { rejectWithValue }) => {
  try {
    const response = await api.post('/bookings/create', bookingData);
    return response.data.booking;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
  }
});

export const cancelBooking = createAsyncThunk('booking/cancelBooking', async (bookingId, { rejectWithValue }) => {
  try {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response.data.booking;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to cancel booking');
  }
});

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    bookings: [],
    availableSlots: [],
    allSlots: [],
    selectedBooking: null,
    loading: false,
    error: null
  },
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
    setSelectedBooking: (state, action) => {
      state.selectedBooking = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch availability
      .addCase(fetchAvailability.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAvailability.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlots = action.payload.availableSlots;
        state.allSlots = action.payload.allSlots || [];
      })
      .addCase(fetchAvailability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel booking
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
  }
});

export const { clearBookingError, setSelectedBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
