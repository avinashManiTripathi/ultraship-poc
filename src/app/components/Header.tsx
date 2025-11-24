"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui';

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

export default function Header({ onMenuToggle, isSidebarOpen }: HeaderProps) {
  const { user, logout, isAdmin } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section - Hamburger & Logo */}
        <div className="flex items-center gap-4">
          <Button
            onClick={onMenuToggle}
            variant="ghost"
            className="p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isSidebarOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </Button>
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.svg" 
              alt="Ultra Ship Logo" 
              width={90} 
              height={40} 
              priority
              className="dark:invert"
            />
          </div>
        </div>

        {/* Horizontal Menu */}
        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" className="px-4 py-2">
            Dashboard
          </Button>
          {isAdmin && (
            <Button variant="ghost" className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30">
              Admin
            </Button>
          )}
        </nav>

        {/* Right section - User Profile */}
        <div className="relative">
          <Button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            variant="ghost"
            className="flex items-center gap-3 px-3 py-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.username}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                {user?.role}
              </p>
            </div>
          </Button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.username}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
              <Button
                onClick={() => {
                  logout();
                  setShowProfileMenu(false);
                }}
                variant="ghost"
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
