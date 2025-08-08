'use client'

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  const navLinks = [
    { name: "News", href: "/news_page" },
    { name: "About", href: "/about" },
    { name: "Support", href: "/support" },
  ]

  return (
    <nav className="w-full border-b bg-background px-4 py-2 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Logo and Brand Name */}
        <Link
        href="/"
        className="group flex items-center space-x-2 rounded-md transition-all duration-200"
        >
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


        {/* Desktop Nav */}
        <div className="hidden md:flex gap-2">
          {navLinks.map(({ name, href }) => (
            <Link
              key={name}
              href={href}
              className={cn(
                "text-sm font-medium px-3 py-1.5 rounded-md transition-colors",
                "hover:bg-muted hover:text-primary",
                pathname === href
                  ? "bg-muted text-primary font-semibold"
                  : "text-muted-foreground"
              )}
            >
              {name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-md hover:bg-muted">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-60">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map(({ name, href }) => (
                  <Link
                    key={name}
                    href={href}
                    className={cn(
                      "text-sm font-medium px-3 py-2 rounded-md transition-colors",
                      pathname === href
                        ? "bg-muted text-primary font-semibold"
                        : "text-muted-foreground hover:text-primary hover:bg-muted"
                    )}
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
