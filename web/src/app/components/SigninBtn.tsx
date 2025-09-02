"use client";
import { signIn } from "next-auth/react";
import React from "react";

function SigninBtn() {
  return (
    <div>
      <button
        className="cursor-pointer text-xs font-extrabold px-5 py-2 border border-black rounded-md bg-green-400 hover:bg-green-500 transition-all ease-in-out"
        onClick={() => signIn("google")}
      >
        SIGN IN
      </button>
    </div>
  );
}

export default SigninBtn;
