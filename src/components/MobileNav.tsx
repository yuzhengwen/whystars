"use client";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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
          <Button variant="ghost" size="icon">
            <MenuIcon />
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent side="left">
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
