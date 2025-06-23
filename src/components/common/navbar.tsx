'use client'

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const pathname = usePathname()

  const navLinks = [
    { name: "News", href: "/" },
    { name: "About", href: "/about" },
    { name: "Support", href: "/support" },
  ]

  return (
    <nav className="w-full border-b bg-background px-4 py-2 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Logo + Brand */}
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

        {/* Nav Links */}
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
      </div>
    </nav>
  )
}
