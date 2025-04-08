import Link from "next/link";
import React from "react";
import { auth, signIn } from "../../auth";
import NavUserAccount from "./NavUserAccount";
import { ModeToggle } from "./ModeToggle";
import { navItems } from "@/lib/constants";
import MobileNav from "./MobileNav";
import { Button } from "./ui/button";

const NavBar = async () => {
  // This is a server component, so we can use async/await here
  const session = await auth();
  return (
    <>
      <header className="justify-between items-center px-4 py-2 bg-secondary text-primary flex">
        <div className="flex items-center space-x-4">
          <MobileNav />
          <h1 className="text-xl font-bold">Why Stars</h1>
        </div>
        <nav className="space-x-4 flex-row items-center md:flex hidden">
          {Array.from(navItems).map(([key, value]) => (
            <Link key={key} href={value} className="nav-button px-4">
              {key}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          {session && session.user ? (
            <>
              <NavUserAccount user={session.user} />
            </>
          ) : (
            <form
              action={async () => {
                "use server"; // This is a server action
                await signIn(); // add "github" to directly use GitHub provider
              }}
            >
              <Button type="submit">Sign In</Button>
            </form>
          )}
        </div>
      </header>
    </>
  );
};

export default NavBar;
