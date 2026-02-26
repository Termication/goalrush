'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet"
import { Menu, ChevronDown, Newspaper, Trophy, Goal, Timer } from "lucide-react" // added icons
import { motion, AnimatePresence } from "framer-motion"
import React from "react"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"

// --- Grouped League Data for Mega Menu ---
const leagueGroups = {
  "TOP 5 LEAGUES": [
    { name: "Premier League", href: "/news_by_category/Premier League", icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
    { name: "La Liga", href: "/news_by_category/laliga", icon: "🇪🇸" },
    { name: "Bundesliga", href: "/news_by_category/Bundesliga", icon: "🇩🇪" },
    { name: "Serie A", href: "/news_by_category/Serie A", icon: "🇮🇹" },
    { name: "Ligue 1", href: "/news_by_category/Ligue 1", icon: "🇫🇷" },
  ],
  "INTERNATIONAL": [
    { name: "World Cup", href: "/news_by_category/World Cup 2026", icon: "🌍" },
    { name: "UEFA", href: "/news_by_category/UEFA", icon: "🇪🇺" },
    { name: "International", href: "/news_by_category/international", icon: "🏆" },
  ],
  "OTHER COMPETITIONS": [
    { name: "Saudi Pro League", href: "/news_by_category/Saudi Pro League", icon: "🇸🇦" },
    { name: "South African Premiership", href: "/news_by_category/South African Premiership", icon: "🇿🇦" },
  ],
  "TRANSFERS": [
    { name: "Transfers", href: "/news_by_category/Transfers", icon: "🔄" },
  ],
}

// Flatten for mobile
const allLeagueLinks = Object.values(leagueGroups).flat()

// --- Navigation Items with icons ---
const navItems = [
  { name: "News", href: "/news_page", icon: Newspaper },
  { name: "Standings", href: "/standings", icon: Timer },
  { name: "Betting", href: "/betting", icon: Goal },
]

// --- Helper function to check for active links ---
const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

// --- Main Navbar Component ---
export default function Navbar() {
  const pathname = usePathname()
  const [megaOpen, setMegaOpen] = useState(false)

  const isLeagueActive = pathname.startsWith('/news_by_category/') || pathname === '/league'

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-md dark:bg-gray-950/80 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        {/* Logo and Brand Name */}
        <Link href="/" className="group flex items-center space-x-2 rounded-md transition-all duration-300 hover:scale-105">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="GoalRush Logo"
              width={50}
              height={50}
              className="object-contain transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
            />
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-indigo-500 group-hover:to-purple-500">
            GoalRush
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(pathname, item.href)

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                  "hover:-translate-y-[1px] hover:bg-indigo-50 dark:hover:bg-indigo-950/30",
                  active && "text-indigo-600 dark:text-indigo-400"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}

          {/* Mega Menu for Competitions (with its own icon) */}
          <div
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
            className="relative"
          >
            <button
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                "hover:-translate-y-[1px] hover:bg-indigo-50 dark:hover:bg-indigo-950/30",
                isLeagueActive && "text-indigo-600 dark:text-indigo-400"
              )}
            >
              <Trophy className="h-4 w-4" />
              Competitions
              {isLeagueActive && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>

            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[600px] rounded-2xl border bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-xl p-6 grid grid-cols-2 gap-6"
                >
                  {Object.entries(leagueGroups).map(([group, items]) => (
                    <div key={group} className={cn(items.length > 4 && "col-span-2")}>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2 font-semibold">
                        {group}
                      </p>
                      <div className="flex flex-col gap-1">
                        {items.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center gap-2 text-sm px-3 py-2 rounded-md transition-all duration-150 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:-translate-y-[1px]"
                          >
                            <span className="text-base">{item.icon}</span>
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all duration-300 hover:scale-110">
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-l border-white/10 shadow-2xl">
              <VisuallyHidden.Root>
                <SheetTitle>Mobile Navigation</SheetTitle>
              </VisuallyHidden.Root>

              <MobileNavContent pathname={pathname} isLeagueActive={isLeagueActive} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

// --- Mobile Navigation Content (with icons) ---
function MobileNavContent({ pathname, isLeagueActive }: { pathname: string; isLeagueActive: boolean }) {
  const [leagueOpen, setLeagueOpen] = useState(false)

  return (
    <div className="flex flex-col gap-1 p-4 mt-12">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <SheetClose asChild key={item.name}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-lg transition-all duration-300",
                "hover:bg-indigo-50 dark:hover:bg-indigo-950/30",
                isActive(pathname, item.href)
                  ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-300"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          </SheetClose>
        )
      })}

      {/* Competitions (collapsible) with icon */}
      <div>
        <button
          onClick={() => setLeagueOpen((o) => !o)}
          aria-expanded={leagueOpen}
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
            "hover:bg-indigo-50 dark:hover:bg-indigo-950/30",
            isLeagueActive
              ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
              : "text-gray-700 dark:text-gray-300"
          )}
        >
          <span className="flex items-center gap-3">
            <Trophy className="h-4 w-4" />
            Competitions
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", leagueOpen && "rotate-180")} />
        </button>
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            leagueOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="mt-1 ml-4 flex flex-col gap-1 border-l-2 border-indigo-200 dark:border-indigo-800 pl-2 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-300 dark:scrollbar-thumb-indigo-700">
            {allLeagueLinks.map(({ name, href, icon }) => (
              <SheetClose asChild key={name}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300",
                    "hover:bg-indigo-50 dark:hover:bg-indigo-950/30",
                    isActive(pathname, href)
                      ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                      : "text-gray-600 dark:text-gray-400"
                  )}
                >
                  <span className="text-base">{icon}</span>
                  {name}
                </Link>
              </SheetClose>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}