"use client";
import React, { Fragment } from "react";
import PostItem from "./PostItem";

import { deletePost, getPostList, startEditingPost } from "@/slices/blog.slice";
import { useSelector } from "react-redux";
import { Post } from "@/interfaces/blog.type";
import PostSkeleton from "./PostSkeleton";
import { RootState, useAppDispatch } from "@/redux/store";

const PostList = () => {
  const dispatch = useAppDispatch();
  //cái useSelector này mỗi khi state ở store chúng ta thay đổi là nó tự gọi lại luôn rồi, nên thêm cái là nó nhảy
  const postList = useSelector((state: RootState) => state.blog.postList);
  const loading = useSelector((state: RootState) => state.blog.loading);

  const handleDelete = (postId: string) => {
    dispatch(deletePost(postId));
  };
  const handleEdit = (postId: string) => {
    dispatch(startEditingPost(postId));
  };
  React.useEffect(() => {
    const res = dispatch(getPostList());

    return () => {
      res.abort();
    };
  }, [dispatch]);

  return (
    <div className='bg-white py-6 sm:py-8 lg:py-12'>
      <div className='mx-auto max-w-screen-xl px-4 md:px-8'>
        <div className='mb-10 md:mb-16'>
          <h2 className='mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl'>
            Duy Charles Blog
          </h2>
          <p className='mx-auto max-w-screen-md text-center text-gray-500 md:text-lg'>
            Đừng bao giờ từ bỏ. Hôm nay khó khăn, ngày mai sẽ trở nên tồi tệ.
            Nhưng ngày mốt sẽ có nắng
          </p>
        </div>
        {/* thêm auto-rows-fr để cho các item trên mỗi dòng có chiều cao bằng với chiều cao của thằng có height cao nhất */}
        <div className='grid gap-4 auto-rows-fr sm:grid-cols-2 md:gap-6 lg:grid-cols-2 xl:grid-cols-2 xl:gap-8'>
          {loading && (
            <Fragment>
              <PostSkeleton />
              <PostSkeleton />
            </Fragment>
          )}
          {!loading &&
            postList.map((post: Post) => {
              return (
                <PostItem
                  key={post.id}
                  post={post}
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default PostList;
