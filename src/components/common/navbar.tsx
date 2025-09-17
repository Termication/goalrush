'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Menu, ChevronDown } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import React from "react"

// --- Data for Navigation Links ---
const leagueLinks = [
    { name: "Premier League", href: "/news_by_category/Premier League" },
    { name: "La Liga", href: "/news_by_category/laliga" },
    { name: "Bundesliga", href: "/news_by_category/Bundesliga" },
    { name: "Serie A", href: "/news_by_category/Serie A" },
    { name: "Ligue 1", href: "/news_by_category/Ligue 1" },
    { name: "World Cup", href: "/news_by_category/World Cup 2026" },
    { name: "UEFA", href: "/news_by_category/UEFA" },
    { name: "Saudi Pro League", href: "/news_by_category/Saudi Pro League" },
    { name: "South African Premiership", href: "/news_by_category/South African Premiership" },
    { name: "International", href: "/news_by_category/international" },
    { name: "Transfers", href: "/news_by_category/Transfers" },
]

// --- Helper function to check for active links ---
const isActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

// --- Main Navbar Component ---
export default function Navbar() {
  const pathname = usePathname()

  const isLeagueActive = pathname.startsWith('/news_by_category/') || pathname === '/league';

  return (
    <nav className="relative z-50 w-full border-b bg-background px-4 py-2 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo and Brand Name */}
        <Link href="/" className="group flex items-center space-x-2 rounded-md transition-all duration-200">
          <Image
            src="/logo.png"
            alt="GoalRush Logo"
            width={50}
            height={50}
            className="object-contain transition-transform duration-200 group-hover:scale-150"
          />
          <span className="text-xl font-bold tracking-tight transition-colors duration-200 group-hover:text-primary">
            GoalRush
          </span>
        </Link>

        {/* --- Desktop Navigation --- */}
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList>
            {/* News Link */}
            <NavigationMenuItem>
              {/* adopted modern 'asChild' pattern */}
              <NavigationMenuLink asChild active={isActive(pathname, "/news_page")}>
                <Link href="/news_page" className={navigationMenuTriggerStyle()}>
                  News
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/* League Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className={cn(isLeagueActive && "bg-accent text-accent-foreground")}>Competitions</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-48 gap-1 p-2">
                  {leagueLinks.map((component) => (
                    <ListItem
                      key={component.name}
                      title={component.name}
                      href={component.href}
                      active={isActive(pathname, component.href)}
                    />
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Betting Link */}
            <NavigationMenuItem>
              {/*adopted modern 'asChild' pattern */}
              <NavigationMenuLink asChild active={isActive(pathname, "/betting")}>
                <Link href="/betting" className={navigationMenuTriggerStyle()}>
                  Betting
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>

        {/* --- Mobile Navigation --- */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md hover:bg-muted">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-60">
              <MobileNavContent pathname={pathname} isLeagueActive={isLeagueActive} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

// --- Reusable ListItem component for NavigationMenu ---
const ListItem = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link> & { active?: boolean; title: string }
>(({ className, title, children, active, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            active ? "bg-accent text-accent-foreground" : "",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"


// --- Component for Mobile Navigation Content ---
function MobileNavContent({ pathname, isLeagueActive }: { pathname: string, isLeagueActive: boolean }) {
  const [leagueOpen, setLeagueOpen] = useState(false)

  return (
    <div className="flex flex-col gap-2 mt-8">
      {/* News Link */}
      <SheetClose asChild>
        <Link
          href="/news_page"
          className={cn(
            "text-sm font-medium px-3 py-2 rounded-md transition-colors",
            isActive(pathname, "/news_page")
              ? "bg-muted text-primary font-semibold"
              : "text-muted-foreground hover:text-primary hover:bg-muted"
          )}
        >
          News
        </Link>
      </SheetClose>

      {/* League (collapsible) */}
      <div>
        <button
          onClick={() => setLeagueOpen((o) => !o)}
          aria-expanded={leagueOpen}
          className={cn(
            "w-full flex items-center justify-between text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
            isLeagueActive
              ? "bg-muted text-primary font-semibold"
              : "text-muted-foreground hover:text-primary hover:bg-muted"
          )}
        >
          <span>League</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", leagueOpen && "rotate-180")} />
        </button>
        {leagueOpen && (
          <div className="mt-1 ml-4 flex flex-col gap-1 border-l-2 pl-2">
            {leagueLinks.map(({ name, href }) => (
              <SheetClose asChild key={name}>
                <Link
                  href={href}
                  className={cn(
                    "text-sm font-medium px-3 py-1.5 rounded-md transition-colors",
                    isActive(pathname, href)
                      ? "bg-muted text-primary font-semibold"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  )}
                >
                  {name}
                </Link>
              </SheetClose>
            ))}
          </div>
        )}
      </div>

      {/* Betting Link */}
      <SheetClose asChild>
        <Link
          href="/betting"
          className={cn(
            "text-sm font-medium px-3 py-2 rounded-md transition-colors",
            isActive(pathname, "/betting")
              ? "bg-muted text-primary font-semibold"
              : "text-muted-foreground hover:text-primary hover:bg-muted"
          )}
        >
          Betting
        </Link>
      </SheetClose>
    </div>
  )
}

