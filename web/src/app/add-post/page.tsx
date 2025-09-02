"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

function AddPostPage() {
  const [content, setContent] = useState("");

  async function handlePost() {
    if (!content.trim()) return;
    // console.log("Post:", content);
    const res = await fetch("/api/addPost", {
      method: "POST",
      body: JSON.stringify({
        postContent: content,
      }),
    });
    const data = await res.json();
    setContent("");
    if (res.status == 200) {
      toast.success(data.message);
    } else {
      toast.error(data.message);
    }
  }

  return (
    <div className="flex justify-center items-start min-h-screen pt-10">
      <Card className="w-full max-w-md shadow-md rounded-2xl">
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Create Post
          </h2>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handlePost();
              }
            }}
            placeholder="What's on your mind?"
            className="resize-none min-h-[120px] rounded-xl overflow-y-auto"
            rows={5}
          />
          <div className="flex justify-end">
            <Button
              onClick={handlePost}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-200"
              disabled={!content.trim()}
            >
              Post
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddPostPage;
