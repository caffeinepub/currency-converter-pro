import {
  ArrowUpDown,
  Clock,
  Delete,
  RefreshCw,
  Share2,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { convertCurrency, useExchangeRates } from "../hooks/useExchangeRates";
import { useQueryParams } from "../hooks/useQueryParams";
import {
  ALL_CURRENCIES,
  CRYPTO_QUICK_SELECT,
  CURRENCY_MAP,
  type CurrencyInfo,
  QUICK_SELECT_CURRENCIES,
} from "../lib/currencies";

interface HistoryEntry {
  id: number;
  fromCode: string;
  toCode: string;
  amount: number;
  result: number;
  timestamp: Date;
}

// ─── Smart Convert natural language parser ────────────────────────────────────
const CURRENCY_NAME_MAP: Record<string, string> = {
  dollar: "USD",
  dollars: "USD",
  usd: "USD",
  euro: "EUR",
  euros: "EUR",
  eur: "EUR",
  pound: "GBP",
  pounds: "GBP",
  sterling: "GBP",
  gbp: "GBP",
  yen: "JPY",
  jpy: "JPY",
  yuan: "CNY",
  renminbi: "CNY",
  cny: "CNY",
  rupee: "INR",
  rupees: "INR",
  inr: "INR",
  franc: "CHF",
  francs: "CHF",
  chf: "CHF",
  "canadian dollar": "CAD",
  cad: "CAD",
  "australian dollar": "AUD",
  aud: "AUD",
  peso: "MXN",
  pesos: "MXN",
  mxn: "MXN",
  real: "BRL",
  reais: "BRL",
  brl: "BRL",
  bitcoin: "BTC",
  btc: "BTC",
  ethereum: "ETH",
  eth: "ETH",
  solana: "SOL",
  sol: "SOL",
  tether: "USDT",
  usdt: "USDT",
  dogecoin: "DOGE",
  doge: "DOGE",
  won: "KRW",
  krw: "KRW",
  "singapore dollar": "SGD",
  sgd: "SGD",
  dirham: "AED",
  aed: "AED",
  krona: "SEK",
  krone: "NOK",
  "swiss franc": "CHF",
};

function parseNaturalLanguage(
  input: string,
): { amount: number; from: string; to: string } | null {
  const lower = input.toLowerCase().trim();
  // Patterns: "100 USD to EUR", "convert 500 pounds to yen", "50 dollars in bitcoin"
  const patterns = [
    /(\d+(?:\.\d+)?)\s+(\w+(?:\s+\w+)?)\s+(?:to|in|into)\s+(\w+(?:\s+\w+)?)/,
    /convert\s+(\d+(?:\.\d+)?)\s+(\w+(?:\s+\w+)?)\s+(?:to|in|into)\s+(\w+(?:\s+\w+)?)/,
    /(\d+(?:\.\d+)?)\s+(\w+(?:\s+\w+)?)\s*=\s*(\w+(?:\s+\w+)?)/,
  ];

  for (const pattern of patterns) {
    const match = lower.match(pattern);
    if (match) {
      const amount = Number.parseFloat(match[1]);
      const fromRaw = match[2].trim();
      const toRaw = match[3].trim();

      const fromCode =
        CURRENCY_NAME_MAP[fromRaw] || fromRaw.toUpperCase().slice(0, 4);
      const toCode =
        CURRENCY_NAME_MAP[toRaw] || toRaw.toUpperCase().slice(0, 4);

      if (!Number.isNaN(amount) && fromCode && toCode) {
        return { amount, from: fromCode, to: toCode };
      }
    }
  }
  return null;
}

// ─── Searchable Currency Dropdown ────────────────────────────────────────────
interface CurrencyDropdownProps {
  value: string;
  onChange: (code: string) => void;
  label: string;
  ocid: string;
  availableCodes: string[];
}

function CurrencyDropdown({
  value,
  onChange,
  label,
  ocid,
  availableCodes,
}: CurrencyDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const currencies = availableCodes
    .map((code) => CURRENCY_MAP[code])
    .filter((c): c is CurrencyInfo => !!c);

  const filtered = search.trim()
    ? currencies.filter(
        (c) =>
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.symbol.toLowerCase().includes(search.toLowerCase()),
      )
    : currencies;

  const selected = CURRENCY_MAP[value];

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const labelId = `label-${ocid}`;
  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <span
        id={labelId}
        className="text-xs font-bold text-usa-navy uppercase tracking-widest"
      >
        {label}
      </span>
      <div className="relative">
        <button
          type="button"
          data-ocid={ocid}
          aria-labelledby={labelId}
          onClick={() => {
            setOpen(!open);
            setSearch("");
          }}
          className="w-full min-h-[56px] flex items-center justify-between gap-2 px-4 py-3 bg-white border-2 border-usa-navy/30 rounded-xl text-left font-semibold text-usa-navy hover:border-usa-red focus-visible:outline-none focus-visible:border-usa-red transition-all shadow-sm"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="flex items-center gap-3 min-w-0">
            <span className="text-2xl leading-none flex-shrink-0">
              {selected?.flag ?? "🌐"}
            </span>
            <span className="flex flex-col min-w-0">
              <span className="font-bold text-usa-navy text-base">
                {selected?.code ?? "Select"}
              </span>
              <span className="text-[11px] text-usa-navy/55 truncate">
                {selected?.name ?? "Choose currency"}
              </span>
            </span>
          </span>
          <svg
            aria-hidden="true"
            className={`w-5 h-5 text-usa-navy/50 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border-2 border-usa-navy rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-2 border-b border-usa-navy/15 flex items-center gap-2 bg-usa-navy/5">
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 text-usa-navy/40 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M16.65 16.65A7.5 7.5 0 1116.65 2a7.5 7.5 0 010 14.65z"
                  />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or code..."
                  className="flex-1 text-sm outline-none text-usa-navy placeholder:text-usa-navy/35 bg-transparent font-medium"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="text-usa-navy/40 hover:text-usa-navy transition-colors"
                    aria-label="Clear search"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <div
                className="max-h-60 overflow-y-auto"
                aria-label="Currency options"
              >
                {filtered.length === 0 ? (
                  <div className="px-4 py-4 text-sm text-usa-navy/45 text-center">
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
                        currency.code === value ? "bg-usa-red/15" : ""
                      }`}
                    >
                      <span className="text-xl leading-none flex-shrink-0">
                        {currency.flag}
                      </span>
                      <span className="flex flex-col min-w-0 flex-1">
                        <span className="font-bold text-usa-navy text-sm">
                          {currency.code}
                        </span>
                        <span className="text-[11px] text-usa-navy/55 truncate">
                          {currency.name}
                        </span>
                      </span>
                      <span className="text-xs text-usa-navy/40 flex-shrink-0 font-mono">
                        {currency.symbol}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Numeric Keypad ────────────────────────────────────────────────────────────
interface KeypadProps {
  onKey: (key: string) => void;
}

function NumericKeypad({ onKey }: KeypadProps) {
  const keys = ["7", "8", "9", "4", "5", "6", "1", "2", "3", ".", "0", "⌫"];
  return (
    <div data-ocid="keypad.button" className="grid grid-cols-3 gap-2">
      {keys.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => onKey(key)}
          className={`min-h-[52px] rounded-xl font-bold text-lg transition-all active:scale-95 select-none ${
            key === "⌫"
              ? "bg-usa-navy text-white hover:bg-usa-red"
              : "bg-white border-2 border-usa-navy/20 text-usa-navy hover:bg-usa-navy/10 hover:border-usa-navy/40"
          }`}
          aria-label={key === "⌫" ? "Backspace" : key}
        >
          {key === "⌫" ? <Delete className="w-5 h-5 mx-auto" /> : key}
        </button>
      ))}
    </div>
  );
}

// ─── Multi-output panel currencies ───────────────────────────────────────────
const MULTI_OUTPUT_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CNY",
  "INR",
];

// ─── Main Converter ─────────────────────────────────────────────────────────
export default function CurrencyConverter() {
  const {
    rates,
    lastUpdated,
    isLoading,
    isError,
    errorMessage,
    cryptoChange24h,
    isCached,
    cacheTime,
  } = useExchangeRates();
  const { getParams, setParams, buildShareUrl } = useQueryParams();

  const [amount, setAmount] = useState("100");
  const [fromCode, setFromCode] = useState("USD");
  const [toCode, setToCode] = useState("EUR");
  const [result, setResult] = useState<number | null>(null);
  const [hasConverted, setHasConverted] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastFocused, setLastFocused] = useState<"from" | "to">("from");
  const [showKeypad, setShowKeypad] = useState(false);
  const [smartInput, setSmartInput] = useState("");
  const [showSmartConvert, setShowSmartConvert] = useState(false);
  const historyCounter = useRef(0);

  // Read URL params on mount
  useEffect(() => {
    const params = getParams();
    if (params.from) setFromCode(params.from);
    if (params.to) setToCode(params.to);
    if (params.amount) setAmount(params.amount);
  }, [getParams]);

  // Auto-convert from URL params when rates load
  useEffect(() => {
    if (!isLoading && Object.keys(rates).length > 0) {
      const params = getParams();
      if (params.from && params.to && params.amount) {
        const amt = Number.parseFloat(params.amount);
        if (!Number.isNaN(amt) && amt > 0) {
          const res = convertCurrency(amt, params.from, params.to, rates);
          if (res !== null) {
            setResult(res);
            setHasConverted(true);
          }
        }
      }
    }
  }, [isLoading, rates, getParams]);

  const handleConvert = useCallback(() => {
    const amt = Number.parseFloat(amount);
    if (!amt || Number.isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }
    const res = convertCurrency(amt, fromCode, toCode, rates);
    if (res === null) {
      toast.error(
        "Conversion failed — rates not available for selected currencies",
      );
      return;
    }
    setResult(res);
    setHasConverted(true);
    setParams({ from: fromCode, to: toCode, amount: amount });

    historyCounter.current += 1;
    const entry: HistoryEntry = {
      id: historyCounter.current,
      fromCode,
      toCode,
      amount: amt,
      result: res,
      timestamp: new Date(),
    };
    setHistory((prev) => [entry, ...prev].slice(0, 5));
  }, [amount, fromCode, toCode, rates, setParams]);

  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
    setResult(null);
    setHasConverted(false);
  };

  const handleKeypad = useCallback((key: string) => {
    if (key === "⌫") {
      setAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    } else if (key === ".") {
      setAmount((prev) => (prev.includes(".") ? prev : `${prev}.`));
    } else {
      setAmount((prev) => {
        if (prev === "0") return key;
        if (prev.length >= 12) return prev;
        return `${prev}${key}`;
      });
    }
    setResult(null);
  }, []);

  const handleQuickSelect = (code: string) => {
    if (lastFocused === "from") {
      setFromCode(code);
    } else {
      setToCode(code);
    }
    setResult(null);
  };

  const handleShare = async () => {
    const url = buildShareUrl({ from: fromCode, to: toCode, amount });
    try {
      await navigator.clipboard.writeText(url);
      toast.success(
        "Link copied! Share it anywhere or add to Google Assistant.",
      );
    } catch {
      toast.error("Could not copy link. Please copy the URL manually.");
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    toast.success("Conversion history cleared");
  };

  const handleSmartConvert = () => {
    const parsed = parseNaturalLanguage(smartInput);
    if (!parsed) {
      toast.error('Try: "100 USD to EUR" or "50 dollars in bitcoin"');
      return;
    }
    const { amount: amt, from, to } = parsed;
    // Validate codes exist
    if (!CURRENCY_MAP[from] && !rates[from]) {
      toast.error(`Unknown currency: ${from}`);
      return;
    }
    setAmount(String(amt));
    setFromCode(from);
    setToCode(to);
    setResult(null);
    setHasConverted(false);
    toast.success(`Set: ${amt} ${from} → ${to}. Press Convert!`);
  };

  const fromInfo = CURRENCY_MAP[fromCode];
  const toInfo = CURRENCY_MAP[toCode];

  const exchangeRate =
    rates[fromCode] && rates[toCode] ? rates[toCode] / rates[fromCode] : null;

  const formatTime = (d: Date) =>
    d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  const formatHistoryTime = (d: Date) =>
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  // Multi-output calculations
  const multiOutputCurrencies = MULTI_OUTPUT_CURRENCIES.filter(
    (c) => c !== fromCode && c !== toCode,
  );

  // Crypto volatility
  const fromChange = cryptoChange24h[fromCode];
  const toChange = cryptoChange24h[toCode];
  const relevantChange =
    fromChange !== undefined
      ? fromChange
      : toChange !== undefined
        ? toChange
        : null;
  const isCryptoConversion = fromInfo?.isCrypto || toInfo?.isCrypto;

  if (isLoading) {
    return (
      <div
        data-ocid="converter.loading_state"
        className="bg-white rounded-2xl shadow-xl border-2 border-usa-navy/20 p-10 flex flex-col items-center gap-4"
      >
        <div className="w-14 h-14 rounded-full border-4 border-usa-navy/20 border-t-usa-red animate-spin" />
        <p className="font-display font-bold text-usa-navy text-xl">
          Fetching live rates...
        </p>
        <p className="text-usa-navy/50 text-sm">
          Connecting to global exchange servers
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Error state banner */}
      <AnimatePresence>
        {isError && (
          <motion.div
            data-ocid="converter.error_state"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-amber-50 border-2 border-amber-300 rounded-xl px-4 py-3 flex items-center gap-3 text-amber-800"
          >
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-bold text-sm">{errorMessage}</p>
              <p className="text-xs opacity-75">
                Conversions will still work with our built-in rates
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cached rates notice */}
      <AnimatePresence>
        {isCached && cacheTime && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 flex items-center gap-2 text-amber-700 text-xs"
          >
            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              Using cached rates from <strong>{formatTime(cacheTime)}</strong> —
              refreshing in background
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Smart Convert ─── */}
      <div className="bg-white rounded-2xl border-2 border-usa-gold/40 shadow-sm overflow-hidden">
        <button
          type="button"
          data-ocid="smartconvert.toggle"
          onClick={() => setShowSmartConvert((v) => !v)}
          className="w-full bg-usa-gold/10 px-4 py-3 border-b border-usa-gold/20 flex items-center gap-3 hover:bg-usa-gold/20 transition-colors"
        >
          <Sparkles className="w-4 h-4 text-usa-gold" />
          <p className="text-xs font-bold text-usa-navy uppercase tracking-widest flex-1 text-left">
            Smart Convert{" "}
            <span className="text-usa-navy/50 normal-case tracking-normal font-normal">
              — Natural language input
            </span>
          </p>
          <span className="text-usa-navy/40 text-xs">
            {showSmartConvert ? "▲" : "▼"}
          </span>
        </button>
        <AnimatePresence>
          {showSmartConvert && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <p className="text-xs text-usa-navy/50">
                  Try: <em>"100 USD to EUR"</em> or{" "}
                  <em>"convert 500 pounds to yen"</em> or{" "}
                  <em>"50 dollars in bitcoin"</em>
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    data-ocid="smartconvert.input"
                    value={smartInput}
                    onChange={(e) => setSmartInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSmartConvert()}
                    placeholder="e.g. 100 USD to EUR"
                    className="flex-1 min-h-[44px] px-4 border-2 border-usa-navy/30 rounded-xl text-sm text-usa-navy font-medium focus:outline-none focus:border-usa-gold transition-all"
                  />
                  <button
                    type="button"
                    data-ocid="smartconvert.primary_button"
                    onClick={handleSmartConvert}
                    className="min-h-[44px] px-4 bg-usa-gold text-usa-navy font-bold rounded-xl hover:bg-usa-gold/80 transition-colors text-sm flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    Go
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Quick Select Chips ─── */}
      <div className="bg-white rounded-2xl border-2 border-usa-navy/15 shadow-sm overflow-hidden">
        <div className="bg-usa-navy/5 px-4 py-2.5 border-b border-usa-navy/10">
          <p className="text-xs font-bold text-usa-navy/60 uppercase tracking-widest">
            Quick Select — <span className="text-usa-red">Tap a chip</span> to
            set {lastFocused === "from" ? "FROM" : "TO"} currency
          </p>
        </div>
        <div className="p-3 flex flex-wrap gap-2">
          {QUICK_SELECT_CURRENCIES.map((code, idx) => {
            const info = CURRENCY_MAP[code];
            const isActive = code === fromCode || code === toCode;
            return (
              <button
                key={code}
                type="button"
                data-ocid={`quickselect.item.${idx + 1}`}
                onClick={() => handleQuickSelect(code)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm transition-all min-h-[36px] active:scale-95 border-2 ${
                  isActive
                    ? "bg-usa-navy text-white border-usa-gold shadow-md"
                    : "bg-usa-red text-white border-usa-red/30 hover:bg-usa-red/85"
                }`}
              >
                <span>{info?.flag ?? "🌐"}</span>
                <span>{code}</span>
              </button>
            );
          })}
        </div>
        {/* Crypto row */}
        <div className="px-3 pb-3 border-t border-usa-navy/8">
          <p className="text-[10px] font-bold text-usa-navy/40 uppercase tracking-widest py-2">
            Crypto
          </p>
          <div className="flex flex-wrap gap-2">
            {CRYPTO_QUICK_SELECT.map((code, idx) => {
              const info = CURRENCY_MAP[code];
              const isActive = code === fromCode || code === toCode;
              const change = cryptoChange24h[code];
              return (
                <button
                  key={code}
                  type="button"
                  data-ocid={`cryptoselect.item.${idx + 1}`}
                  onClick={() => handleQuickSelect(code)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm transition-all min-h-[36px] active:scale-95 border-2 ${
                    isActive
                      ? "bg-usa-navy text-white border-usa-gold shadow-md"
                      : "bg-amber-500 text-white border-amber-400/40 hover:bg-amber-400"
                  }`}
                >
                  <span>{info?.flag ?? "🪙"}</span>
                  <span>{code}</span>
                  {change !== undefined && (
                    <span
                      className={`text-[10px] font-normal ${change >= 0 ? "text-green-200" : "text-red-200"}`}
                    >
                      {change >= 0 ? "+" : ""}
                      {change.toFixed(1)}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── Main Converter Card ─── */}
      <div className="bg-white rounded-2xl shadow-xl border-t-4 border-usa-red border-x-2 border-b-2 border-x-usa-navy/20 border-b-usa-navy/20 overflow-hidden">
        {/* Card Header */}
        <div className="bg-usa-navy px-6 py-4 flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-usa-gold" />
          <h2 className="font-display font-bold text-xl text-white">
            Currency Converter
          </h2>
          {lastUpdated && (
            <span className="ml-auto text-[11px] text-white/50 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              Updated {formatTime(lastUpdated)}
            </span>
          )}
        </div>

        <div className="p-5 space-y-5">
          {/* FROM Section */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: focus-tracking div */}
          <div
            className="space-y-2"
            onFocus={() => setLastFocused("from")}
            onClick={() => setLastFocused("from")}
          >
            <CurrencyDropdown
              value={fromCode}
              onChange={(code) => {
                setFromCode(code);
                setResult(null);
              }}
              label="From Currency"
              ocid="converter.from_select"
              availableCodes={ALL_CURRENCIES.map((c) => c.code)}
            />
          </div>

          {/* Amount Input */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="amount-input"
              className="text-xs font-bold text-usa-navy uppercase tracking-widest"
            >
              Amount
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const val = Number.parseFloat(amount) || 0;
                  if (val > 1) {
                    setAmount(String(Math.max(1, val - (val >= 100 ? 10 : 1))));
                    setResult(null);
                  }
                }}
                className="min-w-[52px] min-h-[60px] flex items-center justify-center bg-usa-navy text-white rounded-xl hover:bg-usa-red transition-colors font-bold text-xl shadow-sm active:scale-95"
                aria-label="Decrease amount"
              >
                −
              </button>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9.]/g, "");
                  const parts = val.split(".");
                  const clean =
                    parts.length > 2
                      ? `${parts[0]}.${parts.slice(1).join("")}`
                      : val;
                  setAmount(clean);
                  setResult(null);
                }}
                id="amount-input"
                onFocus={() => setLastFocused("from")}
                data-ocid="converter.input"
                className="flex-1 min-h-[60px] text-center text-3xl font-bold text-usa-navy border-2 border-usa-navy/30 rounded-xl px-4 focus:outline-none focus:border-usa-red transition-all bg-white shadow-sm"
                placeholder="100"
              />
              <button
                type="button"
                onClick={() => {
                  const val = Number.parseFloat(amount) || 0;
                  setAmount(String(val + (val >= 100 ? 10 : 1)));
                  setResult(null);
                }}
                className="min-w-[52px] min-h-[60px] flex items-center justify-center bg-usa-navy text-white rounded-xl hover:bg-usa-red transition-colors font-bold text-xl shadow-sm active:scale-95"
                aria-label="Increase amount"
              >
                +
              </button>
            </div>
            {/* Toggle Keypad */}
            <button
              type="button"
              data-ocid="keypad.toggle"
              onClick={() => setShowKeypad((v) => !v)}
              className="self-center text-xs font-bold text-usa-navy/50 hover:text-usa-red transition-colors flex items-center gap-1 mt-0.5"
            >
              {showKeypad ? "▲ Hide Keypad" : "▼ Show Number Keypad"}
            </button>
            <AnimatePresence>
              {showKeypad && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2">
                    <NumericKeypad onKey={handleKeypad} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              type="button"
              data-ocid="converter.swap_button"
              onClick={handleSwap}
              className="flex items-center gap-2 px-6 py-3 min-h-[48px] bg-usa-red text-white rounded-full font-bold hover:bg-usa-red/85 transition-all shadow-md active:scale-95 hover:shadow-lg"
              aria-label="Swap currencies"
            >
              <ArrowUpDown className="w-5 h-5" />
              <span className="text-sm uppercase tracking-wider">Swap</span>
            </button>
          </div>

          {/* TO Section */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: focus-tracking div */}
          <div
            className="space-y-2"
            onFocus={() => setLastFocused("to")}
            onClick={() => setLastFocused("to")}
          >
            <CurrencyDropdown
              value={toCode}
              onChange={(code) => {
                setToCode(code);
                setResult(null);
              }}
              label="To Currency"
              ocid="converter.to_select"
              availableCodes={ALL_CURRENCIES.map((c) => c.code)}
            />
          </div>

          {/* Convert Button */}
          <button
            type="button"
            data-ocid="converter.primary_button"
            onClick={handleConvert}
            className="w-full min-h-[64px] bg-usa-red text-white font-display font-bold text-2xl rounded-xl hover:bg-usa-red/90 active:scale-[0.99] transition-all shadow-lg uppercase tracking-wider flex items-center justify-center gap-3"
          >
            <TrendingUp className="w-6 h-6" />
            CONVERT
          </button>

          {/* Result Panel */}
          <AnimatePresence mode="wait">
            {hasConverted && result !== null && (
              <motion.div
                data-ocid="converter.result_panel"
                key={`${fromCode}-${toCode}-${amount}`}
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="bg-gradient-to-br from-usa-navy to-usa-navy/90 rounded-xl p-6 text-center space-y-3 shadow-inner"
              >
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                  Result
                </p>
                {/* Crypto volatility badge */}
                {isCryptoConversion && relevantChange !== null && (
                  <div className="flex justify-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                        relevantChange >= 0
                          ? "bg-green-500/20 text-green-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {relevantChange >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      24h: {relevantChange >= 0 ? "+" : ""}
                      {relevantChange.toFixed(2)}%
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span className="text-white/75 text-lg font-bold">
                    {Number.parseFloat(amount).toLocaleString()}{" "}
                    {fromInfo?.flag} {fromCode}
                  </span>
                  <span className="text-usa-gold text-3xl font-display font-bold">
                    =
                  </span>
                  <span className="text-usa-gold font-display font-black text-4xl sm:text-5xl">
                    {result.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </span>
                  <span className="text-white/75 text-lg font-bold">
                    {toInfo?.flag} {toCode}
                  </span>
                </div>
                {exchangeRate !== null && (
                  <p className="text-white/50 text-sm font-mono">
                    1 {fromCode} = {exchangeRate.toFixed(6)} {toCode}
                  </p>
                )}
                {lastUpdated && (
                  <p className="text-white/35 text-xs">
                    Last updated: {lastUpdated.toLocaleString()}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Multi-output panel */}
          <AnimatePresence>
            {hasConverted && result !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-usa-bg border-2 border-usa-navy/15 rounded-xl overflow-hidden"
              >
                <div className="bg-usa-navy/5 px-4 py-2.5 border-b border-usa-navy/10">
                  <p className="text-xs font-bold text-usa-navy/60 uppercase tracking-widest">
                    {Number.parseFloat(amount).toLocaleString()} {fromCode} also
                    equals...
                  </p>
                </div>
                <div className="p-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {multiOutputCurrencies.map((code) => {
                    const info = CURRENCY_MAP[code];
                    const converted = convertCurrency(
                      Number.parseFloat(amount),
                      fromCode,
                      code,
                      rates,
                    );
                    if (converted === null) return null;
                    return (
                      <div
                        key={code}
                        className="bg-white rounded-lg p-3 text-center border border-usa-navy/10 hover:border-usa-red/30 transition-colors"
                      >
                        <div className="text-xl mb-1">{info?.flag ?? "🌐"}</div>
                        <div className="text-xs font-bold text-usa-navy/50 uppercase">
                          {code}
                        </div>
                        <div className="text-sm font-bold text-usa-navy">
                          {info?.symbol}
                          {converted.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Share Button */}
          <div className="flex justify-end">
            <button
              type="button"
              data-ocid="converter.secondary_button"
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2.5 min-h-[44px] border-2 border-usa-navy/30 text-usa-navy rounded-lg hover:bg-usa-navy hover:text-white transition-all font-semibold text-sm"
            >
              <Share2 className="w-4 h-4" />
              Share / Copy Link
            </button>
          </div>
        </div>
      </div>

      {/* ─── Conversion History Panel ─── */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-usa-navy/20 overflow-hidden">
        <div className="bg-usa-navy px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-usa-gold" />
            <h3 className="font-display font-bold text-white">
              Recent Conversions
            </h3>
          </div>
          {history.length > 0 && (
            <button
              type="button"
              data-ocid="history.delete_button"
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-lg bg-usa-red/20 text-usa-red hover:bg-usa-red hover:text-white transition-all font-bold text-xs uppercase tracking-wider"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
        <div data-ocid="history.list" className="divide-y divide-usa-navy/8">
          <AnimatePresence>
            {history.length === 0 ? (
              <div
                data-ocid="history.empty_state"
                className="px-5 py-6 text-center text-usa-navy/40 text-sm font-medium"
              >
                Your recent conversions will appear here
              </div>
            ) : (
              history.map((entry, idx) => {
                const fi = CURRENCY_MAP[entry.fromCode];
                const ti = CURRENCY_MAP[entry.toCode];
                const ocidIdx = idx + 1;
                return (
                  <motion.div
                    key={entry.id}
                    data-ocid={`history.item.${ocidIdx}`}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    transition={{ duration: 0.2, delay: idx * 0.04 }}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-usa-red/5 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-lg flex-shrink-0">
                      <span>{fi?.flag ?? "🌐"}</span>
                      <span className="text-usa-navy/30 text-sm">→</span>
                      <span>{ti?.flag ?? "🌐"}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-usa-navy text-sm truncate">
                        {entry.amount.toLocaleString()} {entry.fromCode}{" "}
                        <span className="text-usa-red">→</span>{" "}
                        {entry.result.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 6,
                        })}{" "}
                        {entry.toCode}
                      </p>
                    </div>
                    <span className="text-[11px] text-usa-navy/35 flex-shrink-0 font-mono">
                      {formatHistoryTime(entry.timestamp)}
                    </span>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
