"use client";
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LogOut, User } from "lucide-react";
import LogoutButton from "./logout-button";
import { useCurrentUser } from "./hooks/use-current-user";

const UserButton = () => {
  const user = useCurrentUser();
  const initials = user?.name?.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "U";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button aria-label="Open account menu" className={cn("rounded-full outline-none ring-offset-background transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2")}>
          <Avatar className="h-9 w-9 border-2 border-background shadow-md">
            <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User avatar"} />
            <AvatarFallback className="bg-primary text-xs font-black text-primary-foreground">{initials || <User className="h-4 w-4" />}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mr-2 w-64 rounded-2xl p-2 shadow-xl">
        <DropdownMenuItem disabled className="cursor-default rounded-xl px-3 py-3 focus:bg-transparent">
          <div className="min-w-0"><p className="truncate text-sm font-bold text-foreground">{user?.name ?? "Campus member"}</p><p className="truncate text-xs text-muted-foreground">{user?.email ?? "Signed in"}</p></div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <LogoutButton><DropdownMenuItem className="cursor-pointer rounded-xl font-semibold text-destructive focus:bg-destructive/10 focus:text-destructive"><LogOut className="mr-2 h-4 w-4" /> Sign out</DropdownMenuItem></LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
