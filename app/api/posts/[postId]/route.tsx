import { postsRepo } from "@/helpers/posts";
import { Post } from "@/interfaces/blog.type";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const { postId } = params;
  postsRepo.delete(postId);
  return NextResponse.json({});
}
export async function PUT(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const data: Post = await req.json();
  const { postId } = params;
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
    postsRepo.update(postId, data);
    return NextResponse.json(data);
  }
}
