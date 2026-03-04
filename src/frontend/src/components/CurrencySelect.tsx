import { ChevronDown, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Currency } from "../backend";
import { getCurrencyFlag } from "../lib/currencyFlags";

interface CurrencySelectProps {
  currencies: Currency[];
  value: string;
  onChange: (code: string) => void;
  label: string;
  disabled?: boolean;
}

export default function CurrencySelect({
  currencies,
  value,
  onChange,
  label,
  disabled,
}: CurrencySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = currencies.find((c) => c.code === value);

  const filtered = currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1" ref={containerRef}>
      <span className="text-sm font-bold text-usa-navy uppercase tracking-wider">
        {label}
      </span>
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setOpen(!open);
            setSearch("");
          }}
          className="w-full min-h-[56px] flex items-center justify-between gap-2 px-4 py-3 bg-usa-white border-2 border-usa-navy rounded-lg text-left font-semibold text-usa-navy hover:border-usa-red focus:outline-none focus:border-usa-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="flex items-center gap-3 min-w-0">
            <span className="text-2xl leading-none flex-shrink-0">
              {selected ? getCurrencyFlag(selected.code) : "🌐"}
            </span>
            <span className="flex flex-col min-w-0">
              <span className="font-bold text-usa-navy text-base">
                {selected?.code || "Select"}
              </span>
              <span className="text-xs text-usa-navy/60 truncate">
                {selected?.name || "Choose a currency"}
              </span>
            </span>
          </span>
          <ChevronDown
            className={`w-5 h-5 text-usa-navy/60 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-usa-white border-2 border-usa-navy rounded-lg shadow-xl overflow-hidden">
            {/* Search */}
            <div className="p-2 border-b border-usa-navy/20 flex items-center gap-2">
              <Search className="w-4 h-4 text-usa-navy/50 flex-shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search currency..."
                className="flex-1 text-sm outline-none text-usa-navy placeholder:text-usa-navy/40 bg-transparent"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-usa-navy/40 hover:text-usa-navy"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* List */}
            <div
              className="max-h-64 overflow-y-auto"
              aria-label="Currency options"
            >
              {filtered.length === 0 ? (
                <div className="px-4 py-3 text-sm text-usa-navy/50 text-center">
                  No currencies found
                </div>
              ) : (
                filtered.map((currency) => (
                  <button
                    key={currency.code}
                    type="button"
                    aria-selected={currency.code === value}
                    onClick={() => {
                      onChange(currency.code);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-usa-red/10 transition-colors min-h-[44px] ${
                      currency.code === value ? "bg-usa-red/15 font-bold" : ""
                    }`}
                  >
                    <span className="text-xl leading-none flex-shrink-0">
                      {getCurrencyFlag(currency.code)}
                    </span>
                    <span className="flex flex-col min-w-0">
                      <span className="font-bold text-usa-navy text-sm">
                        {currency.code}
                      </span>
                      <span className="text-xs text-usa-navy/60 truncate">
                        {currency.name}
                      </span>
                    </span>
                    <span className="ml-auto text-xs text-usa-navy/50 flex-shrink-0">
                      {currency.symbol}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
