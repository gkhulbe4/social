"use client";
import { Heart } from "lucide-react";
import React, { useState } from "react";

function Likes({
  postId,
  currentUserEmail,
  authorId,
  authorEmail,
  totalLikes,
  userHasLiked,
}: {
  postId: string;
  currentUserEmail: string;
  authorId: string;
  authorEmail: string | null;
  totalLikes: number;
  userHasLiked: boolean;
}) {
  const [postLikes, setPostLikes] = useState(totalLikes);
  const [hasLiked, setHasLiked] = useState(userHasLiked);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    try {
      const res = await fetch("/api/handlePostLike", {
        method: "POST",
        body: JSON.stringify({
          likedByEmail: currentUserEmail,
          postId,
          authorId,
          authorEmail,
        }),
      });

      const data = await res.json();
      //   console.log(data);

      if (hasLiked) {
        setPostLikes((prev) => prev - 1);
      } else {
        setPostLikes((prev) => prev + 1);
      }
      setHasLiked((prev) => !prev);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  }

  return (
    <div className="flex gap-6 mt-4 text-sm text-gray-500">
      <button
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center gap-1 transition ${
          hasLiked ? "text-red-500" : "hover:text-red-500"
        }`}
      >
        <Heart
          className="transition"
          fill={hasLiked ? "red" : "none"}
          height={17}
        />
        {postLikes}
      </button>
    </div>
  );
}

export default Likes;
