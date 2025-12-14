import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMentors = createAsyncThunk('mentor/fetchMentors', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/mentors');
    return response.data.mentors;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch mentors');
  }
});

const mentorSlice = createSlice({
  name: 'mentor',
  initialState: {
    mentors: [],
    selectedMentor: null,
    loading: false,
    error: null
  },
  reducers: {
    setSelectedMentor: (state, action) => {
      state.selectedMentor = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMentors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMentors.fulfilled, (state, action) => {
        state.loading = false;
        state.mentors = action.payload;
      })
      .addCase(fetchMentors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setSelectedMentor } = mentorSlice.actions;
export default mentorSlice.reducer;
