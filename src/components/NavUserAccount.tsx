"use client";
import { User } from "next-auth";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import UserAvatar from "./UserAvatar";

type Props = {
  user: Pick<User, "name" | "image" | "email">;
};
const NavUserAccount = ({ user }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 hover:cursor-pointer">
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex flex-col items-center p-2 space-x-2">
          {user.name && <p className="font-medium">{user.name}</p>}
          {user.email && (
            <p className="w-[200px] truncate text-sm text-gray-500">
              {user.email}
            </p>
          )}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/mytimetables">My Timetables</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          onClick={(e) => {
            e.preventDefault();
            signOut().catch(console.error);
          }}
        >
          <Link href="/settings">
            Sign Out
            <LogOut className="w-4 h-4 ml-auto" />
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavUserAccount;
