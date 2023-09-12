"use client";
import { RootState, useAppDispatch } from "@/redux/store";
import { fetchUsers, increment } from "@/slices/userSlice";

import React from "react";
import { useSelector } from "react-redux";
export default function Home() {
  const userRef = React.useRef(false);

  const { entities, loading, value } = useSelector(
    (state: RootState) => state.user
  );

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    //làm như này do có strict mode nó chạy 2 lần á (tips)
    if (userRef.current === false) {
      dispatch(fetchUsers());
    }

    return () => {
      userRef.current = true;
    };
  }, []);

  return (
    <div>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        entities?.map((user: any) => <h3 key={user.id}>{user.name}</h3>)
      )}

      <button onClick={() => dispatch(increment())}>Click on me</button>
      {value}
    </div>
  );
}
