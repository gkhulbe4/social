"use client";
import React, { useState } from "react";
import { toast } from "sonner";

function NotifyAll() {
  const [adminMessage, setAdminMessage] = useState("");

  async function sendMessage() {
    if (adminMessage.length == 0) {
      toast.info("Please write some message");
      return;
    }
    const res = await fetch("/api/notifyAll", {
      method: "POST",
      body: JSON.stringify({ message: adminMessage }),
    });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
    }
    setAdminMessage("");
  }
  return (
    <div className="flex items-center gap-3 p-4 bg-white shadow-md rounded-2xl w-full max-w-md">
      <input
        className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        type="text"
        placeholder="Type message..."
        value={adminMessage}
        onChange={(e) => setAdminMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
          }
        }}
      />
      <button
        onClick={sendMessage}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-xl shadow-md transition"
      >
        Notify All
      </button>
    </div>
  );
}

export default NotifyAll;
