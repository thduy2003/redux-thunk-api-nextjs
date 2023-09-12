import { NextRequest, NextResponse } from "next/server";

import { postsRepo } from "@/helpers/posts";
import { Post } from "@/interfaces/blog.type";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    data: postsRepo.getAll(),
  });
}
export async function POST(req: NextRequest) {
  const data: Post = await req.json();
  if (new Date(data.publishDate).getTime() < new Date().getTime()) {
    return new NextResponse(
      JSON.stringify({
        error: {
          publishDate: "Không được nhập thời gian trong quá khứ",
        },
      }),
      {
        status: 422,
        headers: { "Content-Type": "application/json" },
      }
    );
  } else {
    postsRepo.create(data);
    return NextResponse.json(data);
  }
}
