"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, BarChart3, History, TrendingUp, Settings } from "lucide-react"
import { UserButton, useUser } from "@civic/auth/react"
import { useAccount } from "wagmi"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ConnectWalletButton } from "./ConnectWalletButton"
import { API_URL } from "@/lib/config"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { user } = useUser()
  const { address } = useAccount()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const linkUser = async () => {
      if (user?.email && address) {
        try {
          await fetch(`${API_URL}/user/link`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              walletAddress: address,
            }),
          });
          // We can console.log the response here for debugging if needed
          // console.log('User link response:', await response.json());
        } catch (error) {
          console.error("Failed to link user:", error);
        }
      }
    };

    linkUser();
  }, [user, address]);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Markets", href: "/markets", icon: TrendingUp },
    { name: "History", href: "/history", icon: History },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-card m-4 rounded-xl" : "bg-[#0A0E17]/90 backdrop-blur-xl border-b border-gray-700/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <img src="https://ik.imagekit.io/3rdfd9oed/Black_and_Green_Modern_Corporate_Finance_Logo__2_-removebg-preview%20(1).png?updatedAt=1755410942148" alt="Satsfi Logo" className="w-12 h-12 object-contain" />
              <Link
                href="/"
                className="text-2xl font-bold gradient-text hover:scale-105 transition-transform duration-200"
              >
                Satsfi
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    isActive(item.href)
                      ? "bg-[#B4FF3C]/20 text-[#B4FF3C] border border-[#B4FF3C]/30 shadow-[0_0_10px_rgba(180,255,60,0.3)]"
                      : "text-[#9CA3AF] hover:text-white hover:bg-[#131923]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              )
            })}

            <div className="relative ml-4">
              <ConnectWalletButton />
                </div>
            <div className="relative ml-4">
              <UserButton />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <ConnectWalletButton />
            <UserButton />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="grid gap-2 py-6">
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/markets"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    Markets
                  </Link>
                  <Link
                    href="/history"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    History
                  </Link>
                  <Link
                    href="/settings"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                    prefetch={false}
                  >
                    Settings
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
