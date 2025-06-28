"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "./button";
import {
  LogOut,
  UserRound,
  CircleUserRound,
  CreditCardIcon,
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
import { Skeleton } from "@/components/ui/skeleton";

interface AppUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  credits?: number;
}

interface UserProfileDropdownProps {
  user: AppUser;
}

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
    <Link
      href={href}
      className={`group relative inline-block overflow-hidden h-5 flex items-center ${textSizeClass}`}
    >
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </Link>
  );
};

const UserProfileDropdown = ({ user }: UserProfileDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          aria-label="Open account menu"
          className="border-[#333] bg-[rgba(31,31,31,0.62)] hover:bg-[rgba(51,51,51,0.62)]"
        >
          {user?.image ? (
            <Image
              src={user.image}
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
          {user?.image ? (
            <Image
              src={user.image}
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
              {user?.name || "User"}
            </span>
            <span className="truncate text-xs font-normal text-gray-400">
              {user?.email || "no email"}
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
                className={`${user?.credits && user.credits > 10 ? "text-green-700" : "text-red-700"}`}
              >
                {user?.credits || 0} left
              </span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-[#333]" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="focus:bg-[#333] focus:text-white text-white">
            <Link href="/features" className="w-full">
              How To Use
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-[#333] focus:text-white text-white">
            <Link href="/pricing" className="w-full">
              Pricing
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-[#333] focus:text-white text-white">
            <Link href="/about" className="w-full">
              About
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-[#333] focus:text-white text-white">
            <Link href="/contact" className="w-full">
              Contact
            </Link>
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
  const [initialLoad, setInitialLoad] = useState(true);

  const { user, isLoaded } = useUserStore();

  const getSafeUser = (User: typeof user | null | undefined): AppUser => ({
    id: String(User?.id ?? ""),
    name: User?.name ?? "",
    email: User?.email ?? "",
    image: User?.image ?? "",
    credits: User?.credits ?? 0,
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => setInitialLoad(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

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

  const logoElement = (
    <div className="w-6 h-6 flex items-center justify-center rounded-md bg-gray-900 text-white text-xs font-mono hover:bg-gray-700 transition">
      <span>&lt;/&gt;</span>
    </div>
  );

  const navLinksData = [
    { label: "How To Use", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const loginButtonElement = (
    <Link href={"/auth/sign-in"} className="w-full sm:w-auto">
      <div className="px-6 py-4 md:py-2 flex items-center justify-center sm:px-3 text-xs sm:text-sm border border-[#333] bg-[rgba(31,31,31,0.62)] text-gray-300 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200 cursor-pointer">
        LogIn
      </div>
    </Link>
  );

  const signupButtonElement = (
    <Link href={"/auth/sign-up"} className="relative group w-full sm:w-auto">
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

  if (initialLoad) {
    return (
      <header
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-20
                   flex flex-col items-center
                   pl-6 pr-6 py-3 backdrop-blur-sm
                   rounded-full
                   border border-[#333] bg-[#1f1f1f57]
                   w-[calc(100%-2rem)] sm:w-auto`}
      >
        <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
          <Skeleton className="w-5 h-5 rounded-full bg-gray-700" />
          <div className="hidden sm:flex gap-6">
            <Skeleton className="h-4 w-16 bg-gray-700" />
            <Skeleton className="h-4 w-16 bg-gray-700" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full bg-gray-700" />
            <div className="hidden sm:flex flex-col gap-1">
              <Skeleton className="h-3 w-24 bg-gray-700" />
              <Skeleton className="h-2 w-16 bg-gray-700" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50
                   flex flex-col items-center
                   pl-6 pr-6 py-3 backdrop-blur-sm
                   ${headerShapeClass}
                   border border-[#333] bg-[#1f1f1f57]
                   w-[calc(100%-2rem)] sm:w-auto
                   transition-[border-radius] duration-0 ease-in-out`}
    >
      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
        <Link href={"/"}>
          <div className="flex items-center">{logoElement}</div>
        </Link>

        <nav className="hidden sm:flex items-center space-x-4 sm:space-x-6 text-sm">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.href} href={link.href}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          {!user ? (
            <>
              {loginButtonElement}
              {signupButtonElement}
            </>
          ) : (
            <UserProfileDropdown user={getSafeUser(user)} />
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
          {!user ? (
            <div className="flex flex-col items-center space-y-4 mt-4 w-full">
              <nav className="flex flex-col items-center space-y-4 text-base w-full">
                {navLinksData.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors w-full text-center"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              {loginButtonElement}
              {signupButtonElement}
            </div>
          ) : (
            <div className="w-full">
              <div className="w-full">
                <div className="flex items-center gap-4 justify-center">
                  {user?.image ? (
                    <Image
                      src={user.image}
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
                  <h1 className="text-gray-400 text-center">{user?.email}</h1>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="text-white flex items-center justify-center mt-4">
                <CreditCardIcon
                  size={16}
                  strokeWidth={2}
                  className="opacity-60 mr-2"
                  aria-hidden="true"
                />
                <div className="flex justify-between w-full">
                  <span className="text-white">Credits</span>
                  <span
                    className={`${user?.credits && user.credits > 10 ? "text-green-700" : "text-red-700"}`}
                  >
                    {user?.credits || 0} left
                  </span>
                </div>
              </div>
              <div className="w-full mt-4">
                <Link
                  href="/features"
                  className="text-white flex items-center justify-center"
                >
                  How to Use
                </Link>
              </div>
              <div className="w-full mt-4">
                <Link
                  href="/features"
                  className="text-white flex items-center justify-center"
                >
                  Features
                </Link>
              </div>
              <div className="w-full mt-4">
                <Link
                  href="/about"
                  className="text-white flex items-center justify-center"
                >
                  About
                </Link>
              </div>
              <div className="w-full mt-4">
                <Link
                  href="/contact"
                  className="text-white flex items-center justify-center"
                >
                  Contact
                </Link>
              </div>

              <Separator className="my-4" />
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
