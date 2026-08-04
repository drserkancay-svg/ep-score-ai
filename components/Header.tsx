"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type HeaderProps = {
  onScoresClick?: () => void;
};

const navigationItems = [
  {
    label: "Scores",
    href: "/scores",
  },
  {
    label: "Categories",
    href: "/#categories",
  },
  {
    label: "AI Assistant",
    href: "/#ai-assistant",
  },
  {
    label: "About",
    href: "/about",
  },
] as const;

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-5 w-6">
      <span
        className={`absolute left-0 top-0.5 h-0.5 w-6 rounded-full bg-current transition duration-300 ${
          open ? "translate-y-2 rotate-45" : ""
        }`}
      />

      <span
        className={`absolute left-0 top-2.5 h-0.5 w-6 rounded-full bg-current transition duration-300 ${
          open ? "scale-x-0 opacity-0" : ""
        }`}
      />

      <span
        className={`absolute left-0 top-[18px] h-0.5 w-6 rounded-full bg-current transition duration-300 ${
          open ? "-translate-y-2 -rotate-45" : ""
        }`}
      />
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function Header({ onScoresClick }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function handleScoresClick() {
    closeMobileMenu();

    if (pathname === "/" && onScoresClick) {
      onScoresClick();
    }
  }

  function isActive(href: string) {
    if (href === "/scores") {
      return pathname.startsWith("/scores");
    }

    if (href === "/about") {
      return pathname === "/about";
    }

    return false;
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 shadow-sm shadow-slate-200/50 backdrop-blur-2xl">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            href="/"
            aria-label="EP-SCORE AI home"
            onClick={closeMobileMenu}
            className="group flex shrink-0 items-center"
          >
            <Image
              src="/images/ep-score-ai-logo.svg"
              alt="EP-SCORE AI — Electrophysiology Calculators"
              width={340}
              height={72}
              priority
              className="h-[58px] w-auto object-contain transition duration-300 group-hover:opacity-90 sm:h-[64px]"
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navigationItems.map((item) => {
              const active = isActive(item.href);

              if (
                item.label === "Scores" &&
                pathname === "/" &&
                onScoresClick
              ) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={handleScoresClick}
                    className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      active
                        ? "bg-cyan-50 text-cyan-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-cyan-50 text-cyan-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/scores"
              className="hidden items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md sm:inline-flex"
            >
              Open calculators
              <ArrowIcon />
            </Link>

            <button
              type="button"
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((current) => !current)}
              className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700 md:hidden"
            >
              <MenuIcon open={mobileMenuOpen} />
            </button>
          </div>
        </div>
      </header>

      <div
        aria-hidden={!mobileMenuOpen}
        className={`fixed inset-0 z-40 transition md:hidden ${
          mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={closeMobileMenu}
          className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
        />

        <div
          className={`absolute inset-x-4 top-24 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/95 p-3 shadow-2xl shadow-slate-400/20 backdrop-blur-2xl transition duration-300 ${
            mobileMenuOpen
              ? "translate-y-0 scale-100"
              : "-translate-y-4 scale-[0.98]"
          }`}
        >
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
            {navigationItems.map((item) => {
              const active = isActive(item.href);

              if (
                item.label === "Scores" &&
                pathname === "/" &&
                onScoresClick
              ) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={handleScoresClick}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-sm font-semibold transition ${
                      active
                        ? "bg-cyan-50 text-cyan-700"
                        : "text-slate-700 hover:bg-white hover:text-slate-950"
                    }`}
                  >
                    {item.label}
                    <ArrowIcon />
                  </button>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                    active
                      ? "bg-cyan-50 text-cyan-700"
                      : "text-slate-700 hover:bg-white hover:text-slate-950"
                  }`}
                >
                  {item.label}
                  <ArrowIcon />
                </Link>
              );
            })}
          </div>

          <Link
            href="/scores"
            onClick={closeMobileMenu}
            className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white shadow-xl shadow-slate-300 transition hover:bg-slate-800"
          >
            Browse all calculators
            <ArrowIcon />
          </Link>

          <p className="px-3 pb-2 pt-4 text-center text-xs leading-5 text-slate-500">
            Evidence-based clinical decision-support tools for cardiac
            electrophysiology.
          </p>
        </div>
      </div>
    </>
  );
}