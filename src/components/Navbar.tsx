"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import Cookies from "js-cookie";

interface NavbarProps {
  user: {
    name: string;
    email: string;
  };
}

export default function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        Cookies.remove("auth-token");

        router.push("/auth/login");
        router.refresh();
      } else {
        console.error("Logout failed");
        Cookies.remove("auth-token");
        router.push("/auth/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      Cookies.remove("auth-token");
      router.push("/auth/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                TaskManager
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>
                Welcome,{" "}
                <span className="font-medium text-gray-900">{user.name}</span>
              </span>
            </div>

            <div className="h-6 w-px bg-gray-300"></div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-600 pb-3 border-b border-gray-100">
                <User className="h-4 w-4" />
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full justify-start text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoggingOut ? "Signing out..." : "Sign out"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
