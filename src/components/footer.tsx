"use client";

import Link from "next/link";
import { DIcons } from "dicons";

export function Footer() {
  return (
    <footer className="border-ali/20 :px-4 mx-auto w-full border-b   border-t  px-2">
      <div className="relative mx-auto grid  max-w-7xl items-center justify-center gap-6 p-10 pb-0 md:flex ">
        <Link href="/">
          <p className="flex items-center justify-center rounded-full  ">
            <DIcons.Designali className="w-8 text-red-600" />
          </p>
        </Link>
        <p className="bg-transparent text-white text-center text-xs leading-4 md:text-left">
          Welcome to codetheft, where creativity meets strategy to bring your
          vision to life. I am passionate about transforming ideas into
          compelling visual experiences. I specialize in crafting unique brand
          identities, immersive digital experiences, and engaging content that
          resonates with your audience. My mission is to empower businesses and
          brands to stand out in a crowded market. I believe in the power of
          design to tell stories, evoke emotions, and drive meaningful
          connections. I believe in quality, not quantity. CodeTheft is actually
          an agency of one. This means you ll work directly with me, founder of
          codetheft.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-y-6">
        <div className="flex flex-wrap items-center justify-center gap-6 gap-y-4 px-6">
          <Link
            aria-label="Logo"
            href="mailto:alkaifk86@gmail.com"
            rel="noreferrer"
            target="_blank"
            className="text-white"
          >
            <DIcons.Mail strokeWidth={1.5} className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Logo"
            href="https://x.com/ghosttrozan"
            rel="noreferrer"
            target="_blank"
            className="text-white"
          >
            <DIcons.X className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Logo"
            href="https://www.instagram.com/ghosttrozan"
            rel="noreferrer"
            target="_blank"
            className="text-white"
          >
            <DIcons.Instagram className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Logo"
            href="https://wa.me/916378211202"
            rel="noreferrer"
            target="_blank"
            className=""
          >
            <DIcons.WhatsApp className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Logo"
            href="https://www.linkedin.com/in/ghosttrozan"
            rel="noreferrer"
            target="_blank"
            className=""
          >
            <DIcons.LinkedIn className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="mx-auto mb-10 mt-10 flex flex-col justify-between text-center text-xs md:max-w-7xl">
        <div className="flex flex-row items-center justify-center gap-1 text-slate-600 dark:text-slate-400">
          <span> © </span>
          <span>{new Date().getFullYear()}</span>
          <span>Made with</span>
          <DIcons.Heart className="text-red-600 mx-1 h-4 w-4 animate-pulse" />
          <span> by </span>
          <span className="hover:text-ali dark:hover:text-ali cursor-pointer text-white dark:text-white">
            <Link
              aria-label="Logo"
              className="font-bold"
              href="https://www.instagram.com/ghosttrozan"
              target="_blank"
            >
              Alkaif {""}
            </Link>
          </span>
          -
          <span className="hover:text-ali dark:hover:text-red-600 cursor-pointer text-slate-600 dark:text-slate-400">
            <Link aria-label="Logo" className="" href="/">
              codetheft
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
