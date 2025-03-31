import Link from "next/link";
import React from "react";
import { auth, signIn } from "../../auth";
import NavUserAccount from "./NavUserAccount";
import { ModeToggle } from "./ModeToggle";

const NavBar = async () => {
  // This is a server component, so we can use async/await here
  const session = await auth();
  return (
    <header className="flex justify-between items-center p-4 bg-accent text-primary rounded-lg shadow-md">
      <div className="text-lg font-bold">Why Stars</div>
      <nav className="space-x-4 flex flex-row items-center">
        <Link href="/" className="nav-button">
          Home
        </Link>
        <Link href="/about" className="nav-button ">
          About
        </Link>
        <Link href="/mods" className="nav-button ">
          Mods
        </Link>
        <Link href="/plan" className="nav-button ">
          Plan
        </Link>
        <ModeToggle />
        {session && session.user ? (
          <>
            <Link href="/profile" className="nav-button">
              <NavUserAccount user={session.user} />
            </Link>
          </>
        ) : (
          <form
            action={async () => {
              "use server"; // This is a server action
              await signIn(); // add "github" to directly use GitHub provider
            }}
          >
            <button type="submit" className="hover:text-gray-400">
              Sign In
            </button>
          </form>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
