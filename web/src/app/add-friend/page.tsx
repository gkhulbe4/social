"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function AddFriendPage() {
  const [friendEmail, setFriendEmail] = useState("");

  async function handleAddFriend() {
    if (!friendEmail.trim()) return;
    const res = await fetch("/api/addFriend", {
      method: "POST",
      body: JSON.stringify({ email: friendEmail }),
    });

    const data = await res.json();
    setFriendEmail("");

    if (res.ok) {
      toast.success(data.message);
    } else {
      toast.error(data.message || "Something went wrong");
    }
  }

  return (
    <div className="flex justify-center items-start min-h-screen pt-10">
      <Card className="w-full max-w-md shadow-md rounded-2xl">
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Add a Friend
          </h2>
          <Input
            type="email"
            placeholder="Enter friend's email"
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddFriend();
              }
            }}
            className="rounded-lg"
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddFriend}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-md transition duration-200"
              disabled={!friendEmail.trim()}
            >
              Send Friend Request
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddFriendPage;
