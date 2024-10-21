'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';

import { UserButton } from '@clerk/nextjs';
import { useAuth, useUser } from '@clerk/nextjs';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Capabilities', href: '#capabilities' },
    { name: 'Who Can Benefit', href: '#who-can-benefit' },
  ];

  return (
    <>
      <header 
        className={`fixed w-full z-40 transition-all duration-500 ${
          isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              {/* <Logo 
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-110" 
                isBlueBackground={!isScrolled}
              /> */}
              <span className={`font-extrabold text-2xl tracking-tight transition-colors duration-300 ${
                isScrolled ? 'text-purple-900' : 'text-purple-900'
              } group-hover:text-purple-700`}>
                Maverick Synergy
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm uppercase tracking-widest font-semibold hover:text-purple-700 transition-all duration-300 ${
                    isScrolled ? 'text-gray-700' : 'text-purple-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {isLoaded && (
                isSignedIn ? (
                  <div className="flex items-center space-x-4">
                    <span className={`text-sm font-semibold ${isScrolled ? 'text-gray-700' : 'text-purple-900'}`}>
                      <FiUser className="inline-block mr-2" />
                      Welcome, {user?.firstName || 'User'}
                    </span>
                    <UserButton />
                    <Link
                      href="/dashboard"
                      className={`px-6 py-2 rounded-full text-sm uppercase tracking-widest font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 ${
                        isScrolled
                          ? 'bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:from-purple-800 hover:to-purple-950'
                          : 'bg-purple-900 text-white hover:bg-purple-800'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/playground"
                      className={`px-6 py-2 rounded-full text-sm uppercase tracking-widest font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 ${
                        isScrolled
                          ? 'bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:from-purple-800 hover:to-purple-950'
                          : 'bg-purple-900 text-white hover:bg-purple-800'
                      }`}
                    >
                      Playground
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/sign-up"
                    className={`px-6 py-2 rounded-full text-sm uppercase tracking-widest font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 ${
                      isScrolled
                        ? 'bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:from-purple-800 hover:to-purple-950'
                        : 'bg-purple-900 text-white hover:bg-purple-800'
                    }`}
                  >
                    Start Building
                  </Link>
                )
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden text-3xl transition-colors duration-300 ${isScrolled ? 'text-purple-900' : 'text-purple-900'} hover:text-purple-700`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 bg-white rounded-lg shadow-xl overflow-hidden">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 uppercase tracking-widest font-semibold transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
                
              ))}
              {isLoaded && (
                isSignedIn ? (
                  <>
                    <div className="px-4 py-2 text-sm text-gray-700 font-semibold">
                      <FiUser className="inline-block mr-2" />
                      {user?.firstName || 'User'}
                    </div>
                    <UserButton />
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-white bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-800 hover:to-purple-950 uppercase tracking-widest font-semibold transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/sign-up"
                    className="block px-4 py-2 text-sm text-white bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-800 hover:to-purple-950 uppercase tracking-widest font-semibold transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Start Building
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
}
