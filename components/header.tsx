"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-lg border-b border-purple-500/20 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Link
                href="/"
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400"
              >
                FaceMojo
              </Link>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center space-x-8"
          >
            <NavLink
              href="/#features"
              isActive={(pathname === "/" && !pathname.includes("#")) || pathname.includes("#features")}
            >
              Features
            </NavLink>
            <NavLink href="/#how-it-works" isActive={pathname.includes("#how-it-works")}>
              How It Works
            </NavLink>
            <NavLink href="/pricing" isActive={pathname === "/pricing"}>
              Pricing
            </NavLink>
            <NavLink href="/#use-cases" isActive={pathname.includes("#use-cases")}>
              Use Cases
            </NavLink>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex items-center space-x-4"
          >
            <Link href="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-full px-8 shadow-lg shadow-purple-700/20">
                Sign Up
              </Button>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-black/95 backdrop-blur-lg border-b border-purple-500/20"
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <MobileNavLink href="/#features" onClick={() => setMobileMenuOpen(false)}>
                Features
              </MobileNavLink>
              <MobileNavLink href="/#how-it-works" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </MobileNavLink>
              <MobileNavLink href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </MobileNavLink>
              <MobileNavLink href="/#use-cases" onClick={() => setMobileMenuOpen(false)}>
                Use Cases
              </MobileNavLink>
              <div className="pt-2 flex flex-col space-y-3">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white shadow-lg shadow-purple-700/20">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  )
}

function NavLink({
  href,
  children,
  isActive = false,
}: { href: string; children: React.ReactNode; isActive?: boolean }) {
  return (
    <Link
      href={href}
      className={`text-gray-300 hover:text-white transition-colors relative group ${isActive ? "text-white" : ""}`}
    >
      {children}
      <span
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-cyan-400 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
      ></span>
    </Link>
  )
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-gray-300 hover:text-white transition-colors py-2 border-b border-gray-800"
    >
      {children}
    </Link>
  )
}
