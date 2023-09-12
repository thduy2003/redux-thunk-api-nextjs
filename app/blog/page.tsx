import CreatePost from "@/components/CreatePost";
import PostList from "@/components/PostList";
import React from "react";

const page = () => {
  return (
    <div className='p-5'>
      <CreatePost />
      <PostList />
    </div>
  );
};

export default page;
