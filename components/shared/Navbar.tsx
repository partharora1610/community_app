import React from "react";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

const Navbar = () => {
  return (
    <>
      <div className="flex bg-slate-100 py-4 px-8">
        <div className="flex-1 text-2xl font-semibold">
          pdf
          <span className="text-indigo-700 text-2xl font-bold">GPT</span>
        </div>
        <div className="flex gap-8 justify-center items-center">
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-gray-600 font-medium hover:text-gray-800"
            >
              Dashboard
            </Link>
          </SignedIn>

          <Link
            href="/pricing"
            className="text-gray-600 font-medium hover:text-gray-800"
          >
            Pricing
          </Link>

          <SignedOut>
            <Link
              href="/sign-in"
              className="text-gray-600 font-medium hover:text-gray-800"
            >
              Sign in
            </Link>

            <Link
              href="/sign-in"
              className="text-gray-600 font-medium hover:text-gray-800"
            >
              Register in
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </>
  );
};

export default Navbar;
