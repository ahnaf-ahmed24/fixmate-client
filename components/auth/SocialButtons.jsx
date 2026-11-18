"use client";

import { FaGithub, FaGoogle } from "react-icons/fa6";


export default function SocialButtons({ onSignIn, disabled = false }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-base-content/40">
        <span className="h-px flex-1 bg-base-300" />
        or continue with
        <span className="h-px flex-1 bg-base-300" />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSignIn("google")}
          className="btn btn-outline rounded-lg font-semibold border-base-300 hover:border-primary hover:text-primary"
        >
          <FaGoogle className="w-4 h-4" /> Google
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onSignIn("github")}
          className="btn btn-outline rounded-lg font-semibold border-base-300 hover:border-base-content"
        >
          <FaGithub className="w-4 h-4" /> GitHub
        </button>
      </div>
    </div>
  );
}
