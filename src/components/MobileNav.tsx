"use client";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu as MenuIcon } from "lucide-react";
import Link from "next/link";
import { navItems } from "@/lib/constants";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="md:hidden flex items-center justify-between text-primary">
        {/* This button will trigger open the mobile sheet menu */}
        <SheetTrigger asChild>
          <MenuIcon size={24} />
        </SheetTrigger>
      </div>
      <SheetContent side="left">
        <SheetTitle>Menu</SheetTitle>
        <div className="flex flex-col items-start">
          {Array.from(navItems).map(([key, value]) => (
            <Link
              key={key}
              href={value}
              className="hover:text-accent p-4"
              onClick={() => setOpen(false)}
            >
              {key}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
