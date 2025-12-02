"use client";
import mainIcon from "@/public/mainIcon.webp";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Search,
  MessageCircle,
  ShoppingCart,
  Menu,
  X,
  ChevronRight,
  Heart,
  User,
  Music,
} from "lucide-react";
import Image from "next/image";
import UserMenu from "./UserMenu";

interface SubCategory {
  name: string;
  slug: string;
}

interface Category {
  name: string;
  slug: string;
  subcategories: SubCategory[];
  isButton?: boolean;
}

const CATEGORIES: Category[] = [
  {
    name: "Indoor Plants",
    slug: "indoor-plants",
    subcategories: [
      { name: "Succulents", slug: "succulents" },
      { name: "Flowering Plants", slug: "flowering-plants" },
      { name: "Foliage Plants", slug: "foliage-plants" },
      { name: "Air Purifying", slug: "air-purifying" },
      { name: "Low Light Plants", slug: "low-light" },
    ],
  },
  {
    name: "Outdoor Plants",
    slug: "outdoor-plants",
    subcategories: [
      { name: "Fruit Trees", slug: "fruit-trees" },
      { name: "Flowering Trees", slug: "flowering-trees" },
      { name: "Shrubs & Bushes", slug: "shrubs-bushes" },
      { name: "Climbing Plants", slug: "climbing-plants" },
      { name: "Ground Cover", slug: "ground-cover" },
    ],
  },
  {
    name: "Soil & Stones",
    slug: "soil-stones",
    subcategories: [
      { name: "Potting Mix", slug: "potting-mix" },
      { name: "Organic Soil", slug: "organic-soil" },
      { name: "Decorative Stones", slug: "decorative-stones" },
      { name: "Pebbles", slug: "pebbles" },
      { name: "Sand & Gravel", slug: "sand-gravel" },
    ],
  },
  {
    name: "Fertilizer & Pesticides",
    slug: "fertilizer-pesticides",
    subcategories: [
      { name: "Organic Fertilizers", slug: "organic-fertilizers" },
      { name: "Chemical Fertilizers", slug: "chemical-fertilizers" },
      { name: "Pest Control", slug: "pest-control" },
      { name: "Plant Food", slug: "plant-food" },
      { name: "Growth Boosters", slug: "growth-boosters" },
    ],
  },
  {
    name: "Pots & Planters",
    slug: "pots-planters",
    subcategories: [
      { name: "Ceramic Pots", slug: "ceramic-pots" },
      { name: "Plastic Planters", slug: "plastic-planters" },
      { name: "Hanging Baskets", slug: "hanging-baskets" },
      { name: "Decorative Pots", slug: "decorative-pots" },
      { name: "Self-Watering", slug: "self-watering" },
    ],
  },
  {
    name: "Seeds",
    slug: "seeds",
    subcategories: [
      { name: "Vegetable Seeds", slug: "vegetable-seeds" },
      { name: "Flower Seeds", slug: "flower-seeds" },
      { name: "Herb Seeds", slug: "herb-seeds" },
      { name: "Fruit Seeds", slug: "fruit-seeds" },
      { name: "Organic Seeds", slug: "organic-seeds" },
    ],
  },
  {
    name: "Hydroponics",
    slug: "hydroponics",
    subcategories: [],
    isButton: true,
  },
  {
    name: "Garden Services",
    slug: "garden-services",
    subcategories: [],
    isButton: true,
  },
];

export default function Header() {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          setIsAtTop(currentScrollY < 10);

          if (currentScrollY < 10) {
            setIsHeaderVisible(true);
          } else {
            setIsHeaderVisible(false);
            setOpenDropdown(null);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleMouseEnter = useCallback((categorySlug: string) => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }
    setOpenDropdown(categorySlug);
  }, []);

  const handleMouseLeave = useCallback(() => {
    dropdownTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  }, []);

  const closeDropdown = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleNavigation = useCallback(() => {
    setIsHeaderVisible((prev) => !prev);
  }, []);

  const mockSuggestions = [
    "Indoor Plants",
    "Outdoor Plants",
    "Succulents",
    "Fertilizers",
    "Pots & Planters",
    "Garden Tools",
    "Seeds",
    "Soil & Stones",
  ];

  useEffect(() => {
    if (searchValue.trim()) {
      const filtered = mockSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(searchValue.toLowerCase())
      );
      setSearchSuggestions(filtered);
    } else {
      setSearchSuggestions(mockSuggestions);
    }
  }, [searchValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  const handleSearchFocus = () => {
    setIsSearchOpen(true);
    if (!searchValue.trim()) {
      setSearchSuggestions(mockSuggestions);
    } else {
      const filtered = mockSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(searchValue.toLowerCase())
      );
      setSearchSuggestions(filtered);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion);
    setIsSearchOpen(false);
    window.location.href = `/products?category=${encodeURIComponent(suggestion)}`;
  };

  return (
    <>
      {(openDropdown || isSearchOpen) && (
        <div
          className="fixed inset-0 bg-black/40 z-30 transition-opacity duration-300"
          style={{
            opacity: openDropdown || isSearchOpen ? 1 : 0,
            pointerEvents: openDropdown || isSearchOpen ? "auto" : "none",
          }}
          onMouseEnter={() => {
            if (dropdownTimerRef.current) {
              clearTimeout(dropdownTimerRef.current);
            }
          }}
          onMouseLeave={() => {
            if (!isSearchOpen) {
              handleMouseLeave();
            }
          }}
          onClick={() => {
            setIsSearchOpen(false);
            setOpenDropdown(null);
          }}
        />
      )}

      <header className="fixed top-0 left-0 right-0 z-50 bg-[#A1D132]">
        <div className="max-w-[88%] mx-auto">
          <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-black p-2 mr-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {!isAtTop && (
                <button
                  onClick={toggleNavigation}
                  className="hidden md:flex text-black cursor-pointer hover:text-gray-700 hover:scale-110 transition-all duration-300 ease-out"
                  aria-label="Toggle navigation menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}

              <a href="/" className="flex items-center">
                <span className="text-xl sm:text-2xl font-bold text-black">
                  <Image src={mainIcon} alt="GreenSouq" className="w-auto h-10 sm:h-14" />
                </span>
              </a>

              <div className="hidden md:flex flex-1 max-w-2xl mx-4">
                <div className="flex w-full relative" ref={searchContainerRef}>
                  <button className="bg-gray-200 px-4 py-2 rounded-l-sm text-sm text-gray-700 hover:bg-gray-300 transition-colors flex items-center gap-2 border-r border-gray-300">
                    All categories
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchValue}
                      onChange={handleSearchChange}
                      onFocus={handleSearchFocus}
                      placeholder="What are you looking for?"
                      className="w-full px-4 py-3 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {isSearchOpen && searchSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
                        {searchSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="w-full text-left px-4 py-3 text-sm text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-2"
                          >
                            <Search className="w-4 h-4 text-gray-400" />
                            <span>{suggestion}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {isSearchOpen && searchValue.trim() && searchSuggestions.length === 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden z-50">
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          No suggestions found
                        </div>
                      </div>
                    )}
                    {isSearchOpen && !searchValue.trim() && searchSuggestions.length === 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden z-50">
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          Start typing to search...
                        </div>
                      </div>
                    )}
                  </div>
                  <button className="bg-black text-white px-4 py-2 rounded-r-sm hover:bg-gray-800 transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-4 text-sm text-black">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xs lg:text-sm">+971 58 512 1105</span>
                  <span className="text-xs lg:text-sm">info@greensouq.ae</span>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <UserMenu />
                <Link
                  href="/favorites"
                  className="relative text-black hover:text-gray-700 transition-colors"
                  aria-label="Favorites"
                >
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                </Link>
                <button className="relative text-black hover:text-gray-700 transition-colors">
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-red-500 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                    0
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="lg:hidden fixed top-[56px] border-t border-lime-600 pl-2 left-0 right-0 w-full bg-[#A1D132] py-3 z-45">
        <div className="max-w-[88%] mx-auto">
          <div className="flex items-center justify-center gap-4 text-sm text-black">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="flex gap-2 ">
              <span className="font-bold text-xs lg:text-sm">+971 58 512 1105</span>
              <span className="text-xs lg:text-sm">info@greensouq.ae</span>
            </div>
          </div>
        </div>
      </div>

      <nav
        className={`fixed py-2 left-0 right-0 z-40 bg-[#A1D132] transition-all duration-500 ease-in-out ${
          isHeaderVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        } hidden md:block lg:top-[64px] top-[112px]`}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="hidden md:flex items-center justify-between">
            {CATEGORIES.map((category) => (
              <div
                key={category.slug}
                className="relative"
                onMouseEnter={() => !category.isButton && handleMouseEnter(category.slug)}
                onMouseLeave={() => !category.isButton && handleMouseLeave()}
              >
                {category.isButton ? (
                  <a
                    href={`/products?category=${category.slug}`}
                    className="flex items-center px-4 py-3 text-black hover:text-gray-700 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <span className="text-base font-medium">{category.name}</span>
                  </a>
                ) : (
                  <>
                    <button
                      className="flex items-center gap-1 px-4 py-3 text-black hover:text-gray-700 cursor-pointer transition-all duration-200 ease-out whitespace-nowrap"
                      aria-expanded={openDropdown === category.slug}
                      aria-haspopup="true"
                    >
                      <span className="text-base font-medium">{category.name}</span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-300 ${
                          openDropdown === category.slug ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white shadow-2xl${
                        openDropdown === category.slug ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                      }`}
                      style={{
                        width: "220px",
                        zIndex: 9999,
                        transformOrigin: "top center",
                        maxHeight: openDropdown === category.slug ? "400px" : "0px",
                        transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out, visibility 0.3s ease-out",
                        overflow: "hidden",
                      }}
                      onMouseEnter={() => handleMouseEnter(category.slug)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="py-3">
                        {category.subcategories.map((subcategory, index) => (
                          <a
                            key={subcategory.slug}
                            href={`/products?category=${category.slug}&subcategory=${subcategory.slug}`}
                            className="block px-4 py-2 text-sm text-gray-900  hover:text-gray-700 transition-colors"
                            onClick={closeDropdown}
                            style={{
                              opacity: openDropdown === category.slug ? 1 : 0,
                              transform: openDropdown === category.slug ? "translateY(0)" : "translateY(-10px)",
                              transition: `opacity 0.3s ease-out ${index * 0.05}s, transform 0.3s ease-out ${index * 0.05}s`,
                            }}
                          >
                            {subcategory.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            <Link
              href="/favorites/songs"
              className="flex items-center px-4 py-3 text-black hover:text-gray-700 cursor-pointer transition-colors whitespace-nowrap"
            >
              <span className="text-base font-medium">Favorites Songs</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Slider */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={closeMobileMenu}
        />

        {/* Menu Panel */}
        <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto">
          <div className="p-4">
            {/* User menu and close button */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <UserMenu />
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="flex">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-900 rounded-l-lg focus:outline-none focus:bg-white border border-gray-300"
                />
                <button className="bg-black text-white px-4 py-3 rounded-r-lg hover:bg-gray-800 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2 mb-6">
              {CATEGORIES.map((category) => (
                <a
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                  className="block px-4 py-3 text-gray-900 hover:bg-gray-100 transition-colors rounded-lg"
                  onClick={closeMobileMenu}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{category.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </a>
              ))}
            </div>

            {/* Contact & Links */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="px-4">
                <div className="font-medium text-gray-900">+971 58 512 1105</div>
                <div className="text-sm text-gray-600">info@greensouq.ae</div>
              </div>

              <Link
                href="/favorites"
                className="flex items-center gap-3 px-4 py-3 text-gray-900 hover:bg-gray-100 transition-colors rounded-lg"
                onClick={closeMobileMenu}
              >
                <Heart className="w-5 h-5" />
                Favorite Products
              </Link>

              <Link
                href="/favorites/songs"
                className="flex items-center gap-3 px-4 py-3 text-gray-900 hover:bg-gray-100 transition-colors rounded-lg"
                onClick={closeMobileMenu}
              >
                <Music className="w-5 h-5" />
                Favorite Songs
              </Link>

              <Link
                href="/auth/login"
                className="flex items-center gap-3 px-4 py-3 text-gray-900 hover:bg-gray-100 transition-colors rounded-lg"
                onClick={closeMobileMenu}
              >
                <User className="w-5 h-5" />
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}