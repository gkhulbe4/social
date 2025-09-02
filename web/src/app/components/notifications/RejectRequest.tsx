"use client";

import { X } from "lucide-react";
import React from "react";

function RejectRequest({
  requestEmail,
  requestId,
}: {
  requestEmail: string;
  requestId: string;
}) {
  async function rejectRequest() {
    await fetch("/api/rejectRequest", {
      method: "POST",
      body: JSON.stringify({
        requestEmail: requestEmail,
        requestId: requestId,
      }),
    });
  }
  return (
    <button
      onClick={rejectRequest}
      className="p-1 rounded-full bg-red-500 hover:bg-red-600 text-white"
    >
      <X className="w-4 h-4" />
    </button>
  );
}

export default RejectRequest;
