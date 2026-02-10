import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type {
  Doubt,
  DoubtPriority,
  DoubtStatus,
  CreateDoubtData,
  UpdateDoubtData,
  ResolveDoubtData
} from '@/types';
import {
  createDoubt as apiCreateDoubt,
  getDoubtsBySubject as apiGetDoubtsBySubject,
  updateDoubt as apiUpdateDoubt,
  resolveDoubt as apiResolveDoubt,
  deleteDoubt as apiDeleteDoubt
} from '@/services/doubtsApi';

export interface DoubtsState {
  doubts: Doubt[];
  selectedDoubt: Doubt | null;
  loading: boolean;
  error: string | null;
}

const initialState: DoubtsState = {
  doubts: [],
  selectedDoubt: null,
  loading: false,
  error: null
};

export const fetchDoubts = createAsyncThunk<
  Doubt[],
  { subjectId: string; status?: DoubtStatus; priority?: DoubtPriority }
>(
  'doubts/fetchDoubts',
  async ({ subjectId, status, priority }, { rejectWithValue }) => {
    try {
      const res = await apiGetDoubtsBySubject(subjectId, { status, priority });
      return res.data;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to load doubts'
      );
    }
  }
);

export const createDoubt = createAsyncThunk<
  Doubt,
  { subjectId: string; payload: CreateDoubtData }
>('doubts/createDoubt', async ({ subjectId, payload }, { rejectWithValue }) => {
  try {
    const res = await apiCreateDoubt(subjectId, payload);
    return res.data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to create doubt'
    );
  }
});

export const updateDoubt = createAsyncThunk<
  Doubt,
  { doubtId: string; payload: UpdateDoubtData }
>('doubts/updateDoubt', async ({ doubtId, payload }, { rejectWithValue }) => {
  try {
    const res = await apiUpdateDoubt(doubtId, payload);
    return res.data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to update doubt'
    );
  }
});

export const resolveDoubt = createAsyncThunk<
  Doubt,
  { doubtId: string; payload?: ResolveDoubtData }
>('doubts/resolveDoubt', async ({ doubtId, payload }, { rejectWithValue }) => {
  try {
    const res = await apiResolveDoubt(doubtId, payload);
    return res.data;
  } catch (error: unknown) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to resolve doubt'
    );
  }
});

export const deleteDoubt = createAsyncThunk<string, { doubtId: string }>(
  'doubts/deleteDoubt',
  async ({ doubtId }, { rejectWithValue }) => {
    try {
      await apiDeleteDoubt(doubtId);
      return doubtId;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to delete doubt'
      );
    }
  }
);

const doubtsSlice = createSlice({
  name: 'doubts',
  initialState,
  reducers: {
    selectDoubt(state, action: PayloadAction<Doubt | null>) {
      state.selectedDoubt = action.payload;
    },
    clearError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoubts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoubts.fulfilled, (state, action) => {
        state.loading = false;
        state.doubts = action.payload;
      })
      .addCase(fetchDoubts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createDoubt.fulfilled, (state, action) => {
        state.doubts.unshift(action.payload);
      })
      .addCase(createDoubt.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateDoubt.fulfilled, (state, action) => {
        const idx = state.doubts.findIndex((d) => d._id === action.payload._id);
        if (idx !== -1) {
          state.doubts[idx] = action.payload;
        }
        if (state.selectedDoubt && state.selectedDoubt._id === action.payload._id) {
          state.selectedDoubt = action.payload;
        }
      })
      .addCase(updateDoubt.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(resolveDoubt.fulfilled, (state, action) => {
        const idx = state.doubts.findIndex((d) => d._id === action.payload._id);
        if (idx !== -1) {
          state.doubts[idx] = action.payload;
        }
        if (state.selectedDoubt && state.selectedDoubt._id === action.payload._id) {
          state.selectedDoubt = action.payload;
        }
      })
      .addCase(resolveDoubt.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteDoubt.fulfilled, (state, action) => {
        state.doubts = state.doubts.filter((d) => d._id !== action.payload);
        if (state.selectedDoubt && state.selectedDoubt._id === action.payload) {
          state.selectedDoubt = null;
        }
      })
      .addCase(deleteDoubt.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export const { selectDoubt, clearError } = doubtsSlice.actions;
export default doubtsSlice.reducer;

