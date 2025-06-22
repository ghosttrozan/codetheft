"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState, useEffect, useRef, use } from "react";
import { Button } from "./button";
import {
  LogOut,
  UserRound,
  CircleUserRound,
  Bolt,
  Layers2,
  BookOpen,
  Pin,
  UserPen,
  CreditCardIcon,
  BanknoteArrowUp,
  History,
  RotateCcwKey,
  HistoryIcon,
} from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useUserStore } from "@/store/userStore";
import { Separator } from "./separator";

const AnimatedNavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const defaultTextColor = "text-gray-300";
  const hoverTextColor = "text-white";
  const textSizeClass = "text-sm";

  return (
    <a
      href={href}
      className={`group relative inline-block overflow-hidden h-5 flex items-center ${textSizeClass}`}
    >
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </a>
  );
};

const UserProfileDropdown = ({
  session,
  user,
}: {
  session: any;
  user: any;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          aria-label="Open account menu"
          className="border-[#333] bg-[rgba(31,31,31,0.62)] hover:bg-[rgba(51,51,51,0.62)]"
        >
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="User avatar"
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <CircleUserRound size={16} strokeWidth={2} aria-hidden="true" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 bg-[#1f1f1f] border-[#333]">
        <DropdownMenuLabel className="flex items-start gap-3">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt="Avatar"
              width={32}
              height={32}
              className="shrink-0 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <UserRound size={16} />
            </div>
          )}
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-gray-200">
              {session?.user?.name || "User"}
            </span>
            <span className="truncate text-xs font-normal text-gray-400">
              {session?.user?.email || "no email"}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#333]" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="focus:bg-[#333] focus:text-white text-white">
            <CreditCardIcon
              size={16}
              strokeWidth={2}
              className="opacity-60 mr-2"
              aria-hidden="true"
            />
            <div className="flex justify-between w-full">
              <span>Credits</span>
              <span
                className={`${user?.credits > 10 ? "text-green-700" : "text-red-700"}`}
              >
                {user?.credits} left
              </span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-[#333] focus:text-white text-white">
            <BanknoteArrowUp
              size={16}
              strokeWidth={2}
              className="opacity-60 mr-2"
              aria-hidden="true"
            />
            <span>Add Credits</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-[#333] focus:text-white text-white">
            <History
              size={16}
              strokeWidth={2}
              className="opacity-60 mr-2"
              aria-hidden="true"
            />
            <span>Usage</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-[#333]" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="focus:bg-[#333] focus:text-white text-white">
            <RotateCcwKey
              size={16}
              strokeWidth={2}
              className="opacity-60 mr-2"
              aria-hidden="true"
            />
            <span>Update Password</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-[#333] focus:text-white text-white">
            <HistoryIcon
              size={16}
              strokeWidth={2}
              className="opacity-60 mr-2"
              aria-hidden="true"
            />
            <span>History</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-[#333]" />
        <DropdownMenuItem
          className="focus:bg-red-900/30 focus:text-red-500 text-red-500"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut
            size={16}
            strokeWidth={2}
            className="opacity-60 mr-2"
            aria-hidden="true"
          />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState("rounded-full");
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: session, status } = useSession();
  console.log(session, status);

  const { user } = useUserStore();

  console.log(user);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass("rounded-xl");
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass("rounded-full");
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${session?.user.id}`);
        const data = await res.json();

        useUserStore.getState().setUser(data);

        console.log(data);

        if (!res.ok) {
          console.error("Error fetching user:", data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (session?.user) {
      fetchUser();
    }
  }, [session]);

  const logoElement = (
    <div className="relative w-5 h-5 flex items-center justify-center">
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 top-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 left-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 right-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
      <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 bottom-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
    </div>
  );

  const navLinksData = [
    { label: "Careers", href: "#2" },
    { label: "Discover", href: "#3" },
  ];

  const loginButtonElement = (
    <Link href={"/auth/sign-in"} className="w-full sm:w-auto">
      <div className="px-6 py-4 md:py-2 flex items-center justify-center sm:px-3 text-xs sm:text-sm border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200 cursor-pointer">
        LogIn
      </div>
    </Link>
  );

  const signupButtonElement = (
    <Link href={"/auth"} className="relative group w-full sm:w-auto">
      <div
        className="absolute inset-0 -m-2 rounded-full
                     hidden sm:block
                     bg-gray-100
                     opacity-40 filter blur-lg pointer-events-none
                     transition-all duration-300 ease-out
                     group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"
      ></div>
      <Button className="relative z-10 px-4 py-2 sm:px-3 text-xs sm:text-sm font-semibold text-black bg-gradient-to-br from-gray-100 to-gray-300 rounded-full hover:from-gray-200 hover:to-gray-400 transition-all duration-200 w-full sm:w-auto">
        Signup
      </Button>
    </Link>
  );

  return (
    <header
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-20
                       flex flex-col items-center
                       pl-6 pr-6 py-3 backdrop-blur-sm
                       ${headerShapeClass}
                       border border-[#333] bg-[#1f1f1f57]
                       w-[calc(100%-2rem)] sm:w-auto
                       transition-[border-radius] duration-0 ease-in-out`}
    >
      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        <div className="flex items-center">{logoElement}</div>

        <nav className="hidden sm:flex items-center space-x-4 sm:space-x-6 text-sm">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.href} href={link.href}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          {!session ? (
            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
              {loginButtonElement}
              {signupButtonElement}
            </div>
          ) : (
            <UserProfileDropdown session={session} user={user} />
          )}
        </div>

        <button
          className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          )}
        </button>
      </div>

      <div
        className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? "max-h-[1000px] opacity-100 pt-4" : "max-h-0 opacity-0 pt-0 pointer-events-none"}`}
      >
        <div className="flex flex-col items-center space-y-4 mt-4 w-full">
          {!session ? (
            <div className="flex flex-col items-center space-y-4 mt-4 w-full">
              <nav className="flex flex-col items-center space-y-4 text-base w-full">
                {navLinksData.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors w-full text-center"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              {loginButtonElement}
              {signupButtonElement}
            </div>
          ) : (
            <div className="">
              <div className="">
                <div className="flex items-center gap-4 justify-center">
                  {user?.image ? (
                    <Image
                      src={user?.image}
                      alt="usr pfp"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  ) : (
                    <UserRound className="text-white" />
                  )}
                  <h1 className="text-white text-center">{user?.name}</h1>
                </div>
                <div className="mt-2">
                  <h1 className="text-gray-400">{user?.email}</h1>
                </div>
              </div>
              <Separator />
              <div className="text-white flex items-center justify-center mt-4">
                <CreditCardIcon
                  size={16}
                  strokeWidth={2}
                  className="opacity-60 mr-2"
                  aria-hidden="true"
                />
                <div className="flex  justify-between w-full">
                  <span className="text-white">Credits</span>
                  <span
                    className={`${user?.credits > 10 ? "text-green-700" : "text-red-700"}`}
                  >
                    {user?.credits} left
                  </span>
                </div>
              </div>
              <div className="text-white flex items-center justify-center mt-4">
                <BanknoteArrowUp
                  size={16}
                  strokeWidth={2}
                  className="opacity-60 mr-2"
                  aria-hidden="true"
                />
                <span className="text-white text-center">Add Credits</span>
              </div>
              <div className="text-white flex items-center justify-center mt-4">
                <History
                  size={16}
                  strokeWidth={2}
                  className="opacity-60 mr-2"
                  aria-hidden="true"
                />
                <span className="text-white text-center">Usage</span>
              </div>
              <div className="text-white flex items-center justify-center mt-4">
                <RotateCcwKey
                  size={16}
                  strokeWidth={2}
                  className="opacity-60 mr-2"
                  aria-hidden="true"
                />
                <span className="text-white text-center">Update Password</span>
              </div>
              <div className="text-white mb-4 flex items-center justify-center mt-4">
                <HistoryIcon
                  size={16}
                  strokeWidth={2}
                  className="opacity-60 mr-2"
                  aria-hidden="true"
                />
                <span className="text-white">History</span>
              </div>
              <Separator />
              <div
                className="focus:bg-red-900/30 flex items-center justify-center mt-4 mb-2 focus:text-red-500 text-red-500"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut
                  size={16}
                  strokeWidth={2}
                  className="opacity-60 mr-2"
                  aria-hidden="true"
                />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
