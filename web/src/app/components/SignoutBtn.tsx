"use client";
import { signOut } from "next-auth/react";
import React from "react";

function SignoutBtn() {
  return (
    <div>
      <button
        className="cursor-pointer text-xs font-bold px-5 py-2 border border-black rounded-md bg-red-400 hover:bg-red-500 transition-all ease-in-out"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        SIGN OUT
      </button>
    </div>
  );
}

export default SignoutBtn;
