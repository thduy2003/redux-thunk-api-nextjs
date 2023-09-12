"use client";
import { Post } from "@/interfaces/blog.type";
import { RootState, useAppDispatch } from "@/redux/store";
import { addPost, cancelEditingPost, updatePost } from "@/slices/blog.slice";

import { unwrapResult } from "@reduxjs/toolkit";
import { Spin } from "antd";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
const initialState: Post = {
  id: "",
  title: "",
  description: "",
  featuredImage: "",
  publishDate: "",
  published: false,
};
type FormError = {
  publishDate: string;
};
const CreatePost = () => {
  const [state, setState] = React.useState<Post>(initialState);
  const [errorForm, setErrorForm] = React.useState<FormError | null>();
  const dispatch = useAppDispatch();
  const loading = useSelector((state: RootState) => state.blog.loading);
  //lấy ra bài viết đang chọn để sửa
  const editingPost = useSelector((state: RootState) => state.blog.editingPost);
  //   dùng ref để khi chọn bài edit nó nhảy lên form edit
  const editRef = React.useRef<any>(null);
  // hàm thay đổi state cho từng input
  const onChangeText =
    (name: keyof Post) =>
    (
      event:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      setState((prev) => ({ ...prev, [name]: event?.target?.value || "" }));
    };
  //hàm thay đổi state checkbox
  const onChangeCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, published: e?.target?.checked || false }));
  };
  // hàm chạy sự kiện khi bấm nút publish post hoặc update
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //nếu có bài viết đang chọn để sửa thì chạy api update ngược lại api post bài mới
    if (editingPost) {
      try {
        //phải unwrap thì qua bên hàm asyncthunk mới bắt được lỗi
        const res = await dispatch(
          updatePost({
            postId: state.id,
            body: state,
          })
        );
        const result: Post = unwrapResult(res);
        if (result) {
          setState(initialState);
          if (errorForm) {
            setErrorForm(null);
          }
        }
      } catch (error: any) {
        setErrorForm(error.error);
      }
    } else {
      try {
        //phải unwrap thì qua bên hàm asyncthunk mới bắt được lỗi

        dispatch(addPost(state))
          .unwrap()
          .then(() => {
            setState(initialState);
            if (errorForm) {
              setErrorForm(null);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error: any) {
        setErrorForm(error.error);
      }
    }
  };
  //hàm chạy sự kiện khi bấm nút cancel
  const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(cancelEditingPost());
    setState(initialState);
  };
  React.useEffect(() => {
    if (editingPost) {
      setState(editingPost);
      setTimeout(() => {
        editRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 300);
    }
  }, [editingPost]);
  return (
    <form onSubmit={handleSubmit} onReset={handleReset} ref={editRef}>
      <div className='mb-6'>
        <label
          htmlFor='title'
          className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'
        >
          Title
        </label>
        <input
          type='text'
          id='title'
          onChange={onChangeText("title")}
          value={state.title}
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
          placeholder='Title'
          required
        />
      </div>
      <div className='mb-6'>
        <label
          htmlFor='featuredImage'
          className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'
        >
          Feature Image
        </label>
        <input
          type='text'
          id='featuredImage'
          onChange={onChangeText("featuredImage")}
          value={state.featuredImage}
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
          placeholder='Feature Image'
          required
        />
      </div>
      <div className='mb-6'>
        <label
          htmlFor='description'
          className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'
        >
          Description
        </label>
        <textarea
          id='description'
          value={state.description}
          onChange={onChangeText("description")}
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
          placeholder='Description'
          required
        />
      </div>
      <div className='mb-6'>
        <label
          htmlFor='publishDate'
          className={`mb-2 block text-sm font-medium  dark:text-gray-300 ${
            errorForm?.publishDate ? "text-red-600" : "text-gray-900"
          }`}
        >
          Publish Date
        </label>
        <input
          type='datetime-local'
          id='publishDate'
          onChange={onChangeText("publishDate")}
          value={state.publishDate}
          className={`block w-56 rounded-lg border  p-2.5 text-sm focus:outline-none ${
            errorForm?.publishDate
              ? "border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 bg-gray-50  text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          }`}
          placeholder='publish date'
          required
        />
        {errorForm?.publishDate && (
          <p className='text-sm text-red-500 mt-2'>
            <span>Lỗi!</span>
            {errorForm.publishDate}
          </p>
        )}
      </div>
      <div className='mb-6 flex items-center'>
        <input
          id='publish'
          type='checkbox'
          checked={state.published}
          onChange={onChangeCheck}
          className='h-4 w-4 focus:ring-2 focus:ring-blue-500'
        />
        <label
          htmlFor='publish'
          className='ml-2 text-sm font-medium text-gray-900'
        >
          Publish
        </label>
      </div>
      <div>
        {!editingPost && (
          <button
            className={`group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800 `}
            type='submit'
            disabled={loading}
          >
            <span
              className={`relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900 ${
                loading ? "cursor-not-allowed bg-gray-500  " : ""
              }`}
            >
              {loading ? "Loading" : "Publish Post"}
            </span>
          </button>
        )}
        {editingPost && (
          <Fragment>
            <button
              type='submit'
              className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800'
            >
              <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                Update Post
              </span>
            </button>

            <button
              type='reset'
              className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400'
            >
              <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                Cancel
              </span>
            </button>
          </Fragment>
        )}
      </div>
    </form>
  );
};

export default CreatePost;
