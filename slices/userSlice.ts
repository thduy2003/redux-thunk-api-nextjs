import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState = {
  entities: [],
  loading: false,
  value: 10,
} as any;
export const fetchUsers = createAsyncThunk(
  "users/getAllUsers",
  async (thunkApi) => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/users?_limit=5"
    );
    const data = await res.json();
    return data;
  }
);
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    increment: (state) => {
      state.value++;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      // Add user to the state array
      state.entities.push(...action.payload);
      state.loading = false;
    });
    builder.addCase(fetchUsers.pending, (state, action) => {
      state.loading = true;
    });
  },
});
export const { increment } = userSlice.actions;

export default userSlice.reducer;
