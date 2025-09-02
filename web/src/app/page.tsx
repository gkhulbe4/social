import { prisma } from "@/lib/prisma";
import PostCard from "./components/posts/PostCard";

export default async function Home() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      content: true,
      author: {
        select: {
          name: true,
          email: true,
          image: true,
          id: true,
        },
      },
      createdAt: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  // console.log(posts);
  return (
    <div className="h-screen py-6">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              authorImg={post.author.image}
              authorName={post.author.name}
              authorEmail={post.author.email}
              authorId={post.author.id}
              createdAt={post.createdAt}
              postId={post.id}
              postContent={post.content}
              totalLikes={post._count.likes}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
