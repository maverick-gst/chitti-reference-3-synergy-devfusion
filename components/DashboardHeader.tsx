'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth, useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import { FaArrowUp, FaCrown } from 'react-icons/fa'; // Import crown icon for the highest tier


export type UserTier = 'free' | 'standard' | 'pro';

interface DashboardHeaderProps {
  tier: UserTier;
}

export default function DashboardHeader({ tier }: DashboardHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Catalog', href: '/catalog' },
    { name: 'Paths', href: '/paths' },
    { name: 'Playground', href: '/playground' },
    { name: 'Viz Mode', href: '/viz-mode' },
    { name: 'Complexity Cube', href: '/cube' },
    { name: 'Profile', href: '/profile' },
    { name: 'Referrals', href: '/referrals' },
  ];

  const getTierDisplay = (tier: UserTier) => {
    switch (tier) {
      case 'free':
        return { name: 'Free Plan', color: 'bg-green-100 text-green-800', icon: null };
      case 'standard':
        return { name: 'Standard Plan', color: 'bg-blue-100 text-blue-800', icon: null };
      case 'pro':
        return { name: 'Pro Plan', color: 'bg-purple-100 text-purple-800', icon: <FaCrown className="inline-block mr-1" /> };
      default:
        return { name: 'Unknown Plan', color: 'bg-gray-100 text-gray-800', icon: null };
    }
  };

  const tierInfo = getTierDisplay(tier);

  const UpgradeButton = () => (
    <Link 
      href="/upgrade" 
      className="
        bg-gradient-to-r from-purple-600 to-indigo-600 
        hover:from-purple-700 hover:to-indigo-700 
        text-white font-bold py-2 px-4 rounded-full 
        transition duration-300 ease-in-out 
        transform hover:scale-105 
        flex items-center space-x-2 
        shadow-lg hover:shadow-xl
        animate-subtle-pulse"
    >
      <FaArrowUp className="text-yellow-300" />
      <span>Upgrade Now</span>
    </Link>
  );

  return (
    <header className="bg-white shadow-sm w-full">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center h-16">
          <Link href="/" className="flex-shrink-0">
            <span className="font-extrabold text-2xl tracking-tight text-purple-800">
              Maverick Synergy
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center justify-center flex-grow">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-base font-medium mx-3 ${
                  pathname === item.href
                    ? 'text-purple-600 font-semibold'
                    : 'text-gray-600 hover:text-purple-600'
                } transition-colors duration-300`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Info, Tier, and Button */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLoaded && isSignedIn && (
              <>
                <span className="text-base font-semibold text-gray-600">Welcome back,</span>
                <span className="text-base font-semibold text-purple-600">
                  {user?.firstName || 'User'}
                </span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full flex items-center ${tierInfo.color}`}>
                  {tierInfo.icon}
                  {tierInfo.name}
                </span>
                {tier !== 'pro' && <UpgradeButton />}
                <UserButton />
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-2xl text-purple-800 hover:text-purple-600 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 w-full">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-2 text-base ${
                  pathname === item.href
                    ? 'text-purple-600 font-semibold'
                    : 'text-gray-600 hover:text-purple-600'
                } transition-colors duration-300`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {isLoaded && isSignedIn && (
              <div className="py-2 flex items-center justify-between">
                <div className="flex flex-col">
                  <div>
                    <span className="text-base font-semibold text-gray-600">Welcome back,</span>
                    <span className="text-base font-semibold text-purple-600 ml-1">
                      {user?.firstName || 'User'}
                    </span>
                  </div>
                  <span className={`text-sm font-medium mt-1 px-3 py-1 rounded-full flex items-center self-start ${tierInfo.color}`}>
                    {tierInfo.icon}
                    {tierInfo.name}
                  </span>
                  {tier !== 'pro' && <UpgradeButton />}
                </div>
                <UserButton />
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}