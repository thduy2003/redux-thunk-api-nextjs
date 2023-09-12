import http from "@/helpers/http";
import { Post } from "@/interfaces/blog.type";
import {
  AnyAction,
  AsyncThunk,
  PayloadAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

interface BlogState {
  postList: Post[];
  editingPost: Post | null;
  loading: boolean;
  currentRequestId: undefined | string;
}
type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>;

type PendingAction = ReturnType<GenericAsyncThunk["pending"]>;
type RejectedAction = ReturnType<GenericAsyncThunk["rejected"]>;
type FulfilledAction = ReturnType<GenericAsyncThunk["fulfilled"]>;

export const getPostList = createAsyncThunk(
  "blog/getPostList",
  async (_, thunkAPI) => {
    const res = await fetch("/api/posts", {
      signal: thunkAPI.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();
    return result?.data;
  }
);
export const addPost = createAsyncThunk(
  "blog/addPost",
  async (body: Omit<Post, "id">, thunkAPI) => {
    try {
      const res = await http.post<Post>("api/posts", body, {
        signal: thunkAPI.signal,
      });

      return res?.data;
    } catch (error: any) {
      // nếu là lỗi 422 thì trả về lỗi từ server gửi
      // ngược lại throw error thì nhảy vào một lỗi bình thường kiểu như này
      if (error.name === "AxiosError" && error.response.status === 422) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);
export const updatePost = createAsyncThunk(
  "blog/updatePost",
  async ({ postId, body }: { postId: string; body: Post }, thunkAPI) => {
    try {
      const res = await http.put<Post>(`api/posts/${postId}`, body, {
        signal: thunkAPI.signal,
      });

      return res?.data;
    } catch (error: any) {
      if (error.name === "AxiosError" && error.response.status === 422) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      throw error;
    }
  }
);
export const deletePost = createAsyncThunk(
  "blog/deletePost",
  async (postId: string, thunkAPI) => {
    const res = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      signal: thunkAPI.signal,
    });

    const result = await res.json();
    return result?.data;
  }
);
const initialState: BlogState = {
  postList: [],
  editingPost: null,
  loading: false,
  currentRequestId: undefined,
};
export const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    startEditingPost: (state, action: PayloadAction<string>) => {
      const postId = action.payload;
      const findPost =
        state.postList.find((post) => post.id === postId) || null;
      state.editingPost = findPost;
    },
    cancelEditingPost: (state) => {
      state.editingPost = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getPostList.fulfilled, (state, action) => {
        state.postList = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.postList.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.postList.find((post, index) => {
          if (post.id === action.meta.arg.postId) {
            state.postList[index] = action.payload;
            return true;
          }
          return false;
        });
        state.editingPost = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        //cái thằng action.meta sẽ có arg chứa object body truyền vào api
        const postId = action.meta.arg;
        const findPostIndex = state.postList.findIndex(
          (post) => post.id === postId
        );
        if (findPostIndex !== -1) {
          state.postList.splice(findPostIndex, 1);
        }
      })
      .addMatcher<PendingAction>(
        (action: AnyAction) => {
          return action.type.endsWith("/pending");
        },
        (state, action) => {
          //bởi vì mình có dùng abort để loại một lần gọi api mà cơ chế asyncthunk nó sẽ tạo cho 1 thằng gọi một requestId , ta lưu lại cái requestId này để so sánh lần gọi api cho đúng để set loading
          state.loading = true;
          state.currentRequestId = action.meta.requestId;
        }
      )
      .addMatcher<RejectedAction | FulfilledAction>(
        (action: AnyAction) => {
          return (
            action.type.endsWith("/fulfilled") ||
            action.type.endsWith("/rejected")
          );
        },
        (state, action) => {
          if (state.currentRequestId === action.meta.requestId) {
            state.loading = false;
            state.currentRequestId = undefined;
          }
        }
      );
  },
});
export const { cancelEditingPost, startEditingPost } = blogSlice.actions;
const blogReducer = blogSlice.reducer;
export default blogReducer;
