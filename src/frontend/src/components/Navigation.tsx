import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  BookOpen,
  Calculator,
  Code2,
  DollarSign,
  Menu,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Converter", icon: DollarSign },
  { href: "/charts", label: "Charts", icon: TrendingUp },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/tools", label: "Tools", icon: Calculator },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/developer-api", label: "API", icon: Code2 },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <nav className="bg-usa-navy border-b-4 border-usa-red shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo area */}
          <Link
            to="/"
            data-ocid="nav.home_link"
            className="flex items-center gap-2 text-usa-white hover:text-usa-gold transition-colors flex-shrink-0"
          >
            <DollarSign className="w-6 h-6 text-usa-gold" />
            <span className="font-display font-bold text-sm sm:text-base tracking-wide uppercase">
              Currency Converter Pro
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                data-ocid={`nav.${link.label.toLowerCase()}_link`}
                className={`px-3 py-2 rounded font-semibold text-xs uppercase tracking-wider transition-all min-h-[44px] flex items-center gap-1.5 ${
                  currentPath === link.href
                    ? "bg-usa-red text-usa-white"
                    : "text-usa-white hover:bg-usa-navy-light hover:text-usa-gold"
                }`}
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            data-ocid="nav.menu_button"
            className="lg:hidden text-usa-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-3 border-t border-usa-navy-light mt-1">
            <div className="grid grid-cols-3 gap-1 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  data-ocid={`nav.mobile.${link.label.toLowerCase()}_link`}
                  className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider transition-all text-center ${
                    currentPath === link.href
                      ? "bg-usa-red text-usa-white"
                      : "text-usa-white hover:bg-usa-navy-light"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
