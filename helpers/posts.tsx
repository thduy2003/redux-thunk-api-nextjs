import fs from "fs";
import postsArray from "../data/blog.json";
import { NextRequest } from "next/server";
import { Post } from "@/interfaces/blog.type";
import { nanoid } from "nanoid";
let posts: Post[] = postsArray;
//giả lập một fake database and method
export const postsRepo: {
  getAll: () => void;
  getById: (id: string) => void;
  find: (x: any) => void;
  create: (post: Post) => void;
  update: (id: string, post: Post) => void;
  delete: (id: string) => void;
} = {
  getAll: () => posts,
  getById: (id) => posts.find((x) => x.id.toString() === id.toString()),
  find: (x) => posts.find(x),
  create,
  update,
  delete: _delete,
};
function create(post: Post) {
  // generate new user id
  // lấy ra phần tử cuối cùng của string id tức là số cuối á xong tìm số lớn nhất để object thêm vào có stt lớn hơn
  post.id = nanoid();

  // add and save user
  posts.push(post);
  saveData();
}

function update(id: string, params: Post) {
  const post = posts.find((x) => x.id === id);

  //const target = { a: 1, b: 2 };
  // const source = { b: 4, c: 5 };
  //const returnedTarget = Object.assign(target, source);
  // Expected output: Object { a: 1, b: 4, c: 5 }
  // dùng Object.assign để hợp nhất các sự thay đổi trả về luôn cho target đó nha
  // update and save
  if (post) Object.assign(post as Post, params);
  saveData();
}

// prefixed with underscore '_' because 'delete' is a reserved word in javascript
function _delete(id: string) {
  // filter out deleted user and save
  posts = posts.filter((x) => x.id !== id);
  saveData();
}
function saveData() {
  fs.writeFileSync("./data/blog.json", JSON.stringify(posts, null, 4));
}
