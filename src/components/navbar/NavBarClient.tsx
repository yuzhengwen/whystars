"use client";
import { signIn, useSession } from "next-auth/react";
import React from "react";
import NavUserAccount from "./NavUserAccount";
import { Button } from "../ui/button";

const NavBarClient = () => {
  const { data: session, status } = useSession();
  return (
    <>
      {status === "authenticated" && session.user ? (
        <NavUserAccount user={session.user} />
      ) : (
        <form
          action={async () => {
            await signIn(); // add "github" to directly use GitHub provider
          }}
        >
          <Button type="submit">Sign In</Button>
        </form>
      )}
    </>
  );
};

export default NavBarClient;
