import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calculator,
  DollarSign,
  Plane,
  PlusCircle,
  Trash2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { convertCurrency, useExchangeRates } from "../hooks/useExchangeRates";
import { ALL_CURRENCIES, CURRENCY_MAP } from "../lib/currencies";

// ─── Expense Tracker Types ────────────────────────────────────────────────────
const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Accommodation",
  "Shopping",
  "Other",
] as const;
type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  date: string;
}

const EXPENSES_KEY = "ccp_expenses";

function loadExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(EXPENSES_KEY);
    return raw ? (JSON.parse(raw) as Expense[]) : [];
  } catch {
    return [];
  }
}

function saveExpenses(expenses: Expense[]) {
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  } catch {
    // ignore
  }
}

const availableCodes = ALL_CURRENCIES.map((c) => c.code);

// ─── Travel Budget Tab ────────────────────────────────────────────────────────
function TravelBudgetTab() {
  const { rates, isLoading } = useExchangeRates();
  const [homeCurrency, setHomeCurrency] = useState("USD");
  const [destCurrency, setDestCurrency] = useState("EUR");
  const [dailyBudget, setDailyBudget] = useState("100");
  const [numDays, setNumDays] = useState("7");

  const daily = Number.parseFloat(dailyBudget) || 0;
  const days = Number.parseFloat(numDays) || 0;
  const totalHome = daily * days;

  const totalDest = useMemo(() => {
    if (isLoading || !totalHome) return null;
    return convertCurrency(totalHome, homeCurrency, destCurrency, rates);
  }, [isLoading, totalHome, homeCurrency, destCurrency, rates]);

  const weeklyBreakdown = Array.from(
    { length: Math.ceil(days / 7) },
    (_, i) => {
      const daysThisWeek = Math.min(7, days - i * 7);
      return {
        week: i + 1,
        daysThisWeek,
        homeAmount: daily * daysThisWeek,
        destAmount:
          totalDest !== null
            ? convertCurrency(
                daily * daysThisWeek,
                homeCurrency,
                destCurrency,
                rates,
              )
            : null,
      };
    },
  );

  const destInfo = CURRENCY_MAP[destCurrency];
  const homeInfo = CURRENCY_MAP[homeCurrency];

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="travel-home"
            className="text-xs font-bold text-usa-navy/60 uppercase tracking-widest"
          >
            Home Currency
          </label>
          <select
            id="travel-home"
            data-ocid="tools.travel.home_select"
            value={homeCurrency}
            onChange={(e) => setHomeCurrency(e.target.value)}
            className="w-full min-h-[48px] px-4 border-2 border-usa-navy/30 rounded-xl font-bold text-usa-navy bg-white focus:outline-none focus:border-usa-red"
          >
            {availableCodes.map((code) => {
              const info = CURRENCY_MAP[code];
              return (
                <option key={code} value={code}>
                  {info?.flag} {code} — {info?.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="travel-dest"
            className="text-xs font-bold text-usa-navy/60 uppercase tracking-widest"
          >
            Destination Currency
          </label>
          <select
            id="travel-dest"
            data-ocid="tools.travel.dest_select"
            value={destCurrency}
            onChange={(e) => setDestCurrency(e.target.value)}
            className="w-full min-h-[48px] px-4 border-2 border-usa-navy/30 rounded-xl font-bold text-usa-navy bg-white focus:outline-none focus:border-usa-red"
          >
            {availableCodes.map((code) => {
              const info = CURRENCY_MAP[code];
              return (
                <option key={code} value={code}>
                  {info?.flag} {code} — {info?.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="travel-daily"
            className="text-xs font-bold text-usa-navy/60 uppercase tracking-widest"
          >
            Daily Budget ({homeInfo?.symbol ?? "$"})
          </label>
          <input
            id="travel-daily"
            type="number"
            min="0"
            data-ocid="tools.travel.daily_input"
            value={dailyBudget}
            onChange={(e) => setDailyBudget(e.target.value)}
            className="w-full min-h-[48px] px-4 border-2 border-usa-navy/30 rounded-xl font-bold text-usa-navy focus:outline-none focus:border-usa-red"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="travel-days"
            className="text-xs font-bold text-usa-navy/60 uppercase tracking-widest"
          >
            Number of Days
          </label>
          <input
            id="travel-days"
            type="number"
            min="1"
            data-ocid="tools.travel.days_input"
            value={numDays}
            onChange={(e) => setNumDays(e.target.value)}
            className="w-full min-h-[48px] px-4 border-2 border-usa-navy/30 rounded-xl font-bold text-usa-navy focus:outline-none focus:border-usa-red"
          />
        </div>
      </div>

      {/* Results */}
      {daily > 0 && days > 0 && (
        <div className="bg-gradient-to-br from-usa-navy to-usa-navy/90 rounded-xl p-6 text-white space-y-3">
          <p className="text-white/60 text-xs uppercase tracking-widest font-bold">
            Budget Summary
          </p>
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-white/50 text-xs">Total in {homeCurrency}</p>
              <p className="font-display font-bold text-2xl text-usa-gold">
                {homeInfo?.symbol}
                {totalHome.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            {totalDest !== null && (
              <div>
                <p className="text-white/50 text-xs">Total in {destCurrency}</p>
                <p className="font-display font-bold text-2xl text-usa-gold">
                  {destInfo?.symbol}
                  {totalDest.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Weekly breakdown */}
      {weeklyBreakdown.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-usa-navy text-sm uppercase tracking-wider">
            Weekly Breakdown
          </h3>
          <div className="space-y-2">
            {weeklyBreakdown.map((w) => (
              <div
                key={w.week}
                className="flex items-center justify-between bg-usa-bg rounded-lg px-4 py-3 border border-usa-navy/10"
              >
                <span className="font-bold text-usa-navy text-sm">
                  Week {w.week} ({w.daysThisWeek} days)
                </span>
                <div className="text-right">
                  <span className="font-bold text-usa-navy text-sm">
                    {homeInfo?.symbol}
                    {w.homeAmount.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  {w.destAmount !== null && (
                    <span className="text-usa-navy/50 text-xs block">
                      ≈ {destInfo?.symbol}
                      {w.destAmount.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tip Calculator Tab ───────────────────────────────────────────────────────
const TIP_PRESETS = [10, 15, 18, 20, 25];
const SPLIT_OPTIONS = [1, 2, 3, 4, 5];

function TipCalculatorTab() {
  const [billAmount, setBillAmount] = useState("50");
  const [currency, setCurrency] = useState("USD");
  const [tipPercent, setTipPercent] = useState(18);
  const [customTip, setCustomTip] = useState("");
  const [splitCount, setSplitCount] = useState(1);
  const [isCustom, setIsCustom] = useState(false);

  const bill = Number.parseFloat(billAmount) || 0;
  const effectiveTip = isCustom
    ? Number.parseFloat(customTip) || 0
    : tipPercent;
  const tipAmount = (bill * effectiveTip) / 100;
  const total = bill + tipAmount;
  const perPerson = total / splitCount;

  const currInfo = CURRENCY_MAP[currency];

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="tip-bill"
            className="text-xs font-bold text-usa-navy/60 uppercase tracking-widest"
          >
            Bill Amount
          </label>
          <input
            id="tip-bill"
            type="number"
            min="0"
            data-ocid="tools.tip.bill_input"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            className="w-full min-h-[48px] px-4 border-2 border-usa-navy/30 rounded-xl font-bold text-usa-navy focus:outline-none focus:border-usa-red"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="tip-currency"
            className="text-xs font-bold text-usa-navy/60 uppercase tracking-widest"
          >
            Currency
          </label>
          <select
            id="tip-currency"
            data-ocid="tools.tip.currency_select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full min-h-[48px] px-4 border-2 border-usa-navy/30 rounded-xl font-bold text-usa-navy bg-white focus:outline-none focus:border-usa-red"
          >
            {availableCodes.map((code) => {
              const info = CURRENCY_MAP[code];
              return (
                <option key={code} value={code}>
                  {info?.flag} {code}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Tip presets */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-usa-navy/60 uppercase tracking-widest">
          Tip Percentage
        </span>
        <div className="flex flex-wrap gap-2">
          {TIP_PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              data-ocid={"tools.tip.preset_button"}
              onClick={() => {
                setTipPercent(p);
                setIsCustom(false);
              }}
              className={`px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all min-h-[44px] ${
                !isCustom && tipPercent === p
                  ? "bg-usa-red text-white border-usa-red"
                  : "bg-white text-usa-navy border-usa-navy/20 hover:border-usa-red"
              }`}
            >
              {p}%
            </button>
          ))}
          <button
            type="button"
            onClick={() => setIsCustom(true)}
            className={`px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all min-h-[44px] ${
              isCustom
                ? "bg-usa-red text-white border-usa-red"
                : "bg-white text-usa-navy border-usa-navy/20 hover:border-usa-red"
            }`}
          >
            Custom
          </button>
        </div>
        {isCustom && (
          <input
            type="number"
            min="0"
            max="100"
            data-ocid="tools.tip.custom_input"
            value={customTip}
            onChange={(e) => setCustomTip(e.target.value)}
            placeholder="Custom %"
            className="w-32 min-h-[44px] px-4 border-2 border-usa-red rounded-xl font-bold text-usa-navy focus:outline-none"
          />
        )}
      </div>

      {/* Split */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-usa-navy/60 uppercase tracking-widest">
          Split Between
        </span>
        <div className="flex gap-2">
          {SPLIT_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              data-ocid={"tools.tip.split_button"}
              onClick={() => setSplitCount(n)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-all min-h-[44px] ${
                splitCount === n
                  ? "bg-usa-navy text-white border-usa-navy"
                  : "bg-white text-usa-navy border-usa-navy/20 hover:border-usa-navy"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      <div className="bg-gradient-to-br from-usa-navy to-usa-navy/90 rounded-xl p-6 text-white grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Tip Amount",
            value: `${currInfo?.symbol}${tipAmount.toFixed(2)}`,
          },
          {
            label: "Total Bill",
            value: `${currInfo?.symbol}${total.toFixed(2)}`,
          },
          {
            label: `Per Person (${splitCount})`,
            value: `${currInfo?.symbol}${perPerson.toFixed(2)}`,
          },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
              {item.label}
            </p>
            <p className="font-display font-bold text-2xl text-usa-gold">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Loan Calculator Tab ──────────────────────────────────────────────────────
function LoanCalculatorTab() {
  const [loanAmount, setLoanAmount] = useState("10000");
  const [annualRate, setAnnualRate] = useState("5");
  const [termMonths, setTermMonths] = useState([36]);

  const principal = Number.parseFloat(loanAmount) || 0;
  const monthlyRate = (Number.parseFloat(annualRate) || 0) / 100 / 12;
  const n = termMonths[0];

  const monthlyPayment =
    monthlyRate > 0
      ? (principal * (monthlyRate * (1 + monthlyRate) ** n)) /
        ((1 + monthlyRate) ** n - 1)
      : principal / n;
  const totalPayment = monthlyPayment * n;
  const totalInterest = totalPayment - principal;

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="loan-amount"
            className="text-xs font-bold text-usa-navy/60 uppercase tracking-widest"
          >
            Loan Amount ($)
          </label>
          <input
            id="loan-amount"
            type="number"
            min="0"
            data-ocid="tools.loan.amount_input"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="w-full min-h-[48px] px-4 border-2 border-usa-navy/30 rounded-xl font-bold text-usa-navy focus:outline-none focus:border-usa-red"
          />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="loan-rate"
            className="text-xs font-bold text-usa-navy/60 uppercase tracking-widest"
          >
            Annual Interest Rate (%)
          </label>
          <input
            id="loan-rate"
            type="number"
            step="0.1"
            min="0"
            max="100"
            data-ocid="tools.loan.rate_input"
            value={annualRate}
            onChange={(e) => setAnnualRate(e.target.value)}
            className="w-full min-h-[48px] px-4 border-2 border-usa-navy/30 rounded-xl font-bold text-usa-navy focus:outline-none focus:border-usa-red"
          />
        </div>
      </div>

      {/* Term slider */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-xs font-bold text-usa-navy/60 uppercase tracking-widest">
            Loan Term
          </span>
          <span className="text-sm font-bold text-usa-navy">
            {termMonths[0]} months ({(termMonths[0] / 12).toFixed(1)} years)
          </span>
        </div>
        <Slider
          data-ocid="tools.loan.term_input"
          min={6}
          max={360}
          step={6}
          value={termMonths}
          onValueChange={setTermMonths}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-usa-navy/40">
          <span>6 mo</span>
          <span>30 yrs</span>
        </div>
      </div>

      {/* Results */}
      <div className="bg-gradient-to-br from-usa-navy to-usa-navy/90 rounded-xl p-6 text-white grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Monthly Payment",
            value: `$${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
            highlight: true,
          },
          {
            label: "Total Payment",
            value: `$${totalPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
            highlight: false,
          },
          {
            label: "Total Interest",
            value: `$${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
            highlight: false,
          },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">
              {item.label}
            </p>
            <p
              className={`font-display font-bold ${item.highlight ? "text-3xl text-usa-gold" : "text-2xl text-white"}`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Quick amortization glimpse */}
      <div className="space-y-2">
        <h3 className="font-bold text-usa-navy text-sm uppercase tracking-wider">
          Amortization Preview
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-usa-navy/5 text-usa-navy/60 text-xs font-bold uppercase tracking-wider">
                <th className="px-4 py-2 text-left">Month</th>
                <th className="px-4 py-2 text-right">Payment</th>
                <th className="px-4 py-2 text-right">Principal</th>
                <th className="px-4 py-2 text-right">Interest</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, Math.floor(n / 2), n - 1, n].map((mo) => {
                if (mo < 1 || mo > n) return null;
                const prevBalance =
                  principal * (1 + monthlyRate) ** (mo - 1) -
                  (monthlyPayment * ((1 + monthlyRate) ** (mo - 1) - 1)) /
                    monthlyRate;
                const interestPaid = prevBalance * monthlyRate;
                const principalPaid = monthlyPayment - interestPaid;
                return (
                  <tr
                    key={mo}
                    className="border-b border-usa-navy/8 hover:bg-usa-bg"
                  >
                    <td className="px-4 py-2 font-bold text-usa-navy">{mo}</td>
                    <td className="px-4 py-2 text-right">
                      ${monthlyPayment.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right text-green-600">
                      ${Math.max(0, principalPaid).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-right text-red-600">
                      ${Math.max(0, interestPaid).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Expense Tracker Tab ──────────────────────────────────────────────────────
function ExpenseTrackerTab() {
  const { rates, isLoading } = useExchangeRates();
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses());
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | "All">(
    "All",
  );

  // Form
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [category, setCategory] = useState<ExpenseCategory>("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleAddExpense = () => {
    const amt = Number.parseFloat(amount);
    if (!desc.trim()) {
      toast.error("Please enter a description");
      return;
    }
    if (Number.isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    const exp: Expense = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      description: desc.trim(),
      amount: amt,
      currency,
      category,
      date,
    };
    const updated = [exp, ...expenses];
    setExpenses(updated);
    saveExpenses(updated);
    setDesc("");
    setAmount("");
    toast.success("Expense added");
  };

  const handleDelete = (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    saveExpenses(updated);
  };

  const filtered =
    filterCategory === "All"
      ? expenses
      : expenses.filter((e) => e.category === filterCategory);

  const totalUSD = useMemo(() => {
    if (isLoading) return 0;
    return expenses.reduce((sum, e) => {
      const usdAmount = convertCurrency(e.amount, e.currency, "USD", rates);
      return sum + (usdAmount ?? 0);
    }, 0);
  }, [expenses, rates, isLoading]);

  return (
    <div className="space-y-6 p-6">
      {/* Add form */}
      <div className="bg-usa-bg rounded-xl p-5 border-2 border-usa-navy/10 space-y-4">
        <h3 className="font-bold text-usa-navy uppercase tracking-wider text-sm">
          Add Expense
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            data-ocid="tools.expense.desc_input"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description"
            className="min-h-[44px] px-4 border-2 border-usa-navy/20 rounded-xl text-sm font-medium text-usa-navy focus:outline-none focus:border-usa-red"
          />
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              data-ocid="tools.expense.amount_input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="flex-1 min-h-[44px] px-4 border-2 border-usa-navy/20 rounded-xl text-sm font-medium text-usa-navy focus:outline-none focus:border-usa-red"
            />
            <select
              data-ocid="tools.expense.currency_select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="min-h-[44px] px-3 border-2 border-usa-navy/20 rounded-xl text-sm font-bold text-usa-navy bg-white focus:outline-none focus:border-usa-red"
            >
              {availableCodes.slice(0, 30).map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>
          <select
            data-ocid="tools.expense.category_select"
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="min-h-[44px] px-4 border-2 border-usa-navy/20 rounded-xl text-sm font-bold text-usa-navy bg-white focus:outline-none focus:border-usa-red"
          >
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="date"
            data-ocid="tools.expense.date_input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="min-h-[44px] px-4 border-2 border-usa-navy/20 rounded-xl text-sm font-medium text-usa-navy focus:outline-none focus:border-usa-red"
          />
        </div>
        <Button
          type="button"
          data-ocid="tools.expense.add_button"
          onClick={handleAddExpense}
          className="bg-usa-red hover:bg-usa-red/85 text-white font-bold rounded-xl min-h-[44px]"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Total */}
      <div className="bg-usa-navy rounded-xl px-5 py-4 flex items-center justify-between">
        <span className="text-white/60 text-sm font-bold uppercase tracking-wider">
          Total (USD)
        </span>
        <span className="font-display font-bold text-2xl text-usa-gold">
          ${totalUSD.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {(["All", ...EXPENSE_CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            data-ocid={"tools.expense.filter_tab"}
            onClick={() => setFilterCategory(cat as ExpenseCategory | "All")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
              filterCategory === cat
                ? "bg-usa-navy text-white border-usa-navy"
                : "bg-white text-usa-navy/60 border-usa-navy/20 hover:border-usa-navy"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expense list */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div
            data-ocid="tools.expense.empty_state"
            className="text-center py-8 text-usa-navy/40 text-sm"
          >
            No expenses yet. Add your first expense above.
          </div>
        ) : (
          filtered.map((exp, idx) => {
            const currInfo = CURRENCY_MAP[exp.currency];
            const usdAmount = !isLoading
              ? convertCurrency(exp.amount, exp.currency, "USD", rates)
              : null;
            return (
              <div
                key={exp.id}
                data-ocid={`tools.expense.item.${idx + 1}`}
                className="flex items-center gap-4 bg-white border-2 border-usa-navy/10 rounded-xl px-4 py-3 hover:border-usa-red/20 transition-colors"
              >
                <Badge
                  variant="outline"
                  className="border-usa-navy/20 text-usa-navy/50 text-xs flex-shrink-0"
                >
                  {exp.category}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-usa-navy text-sm truncate">
                    {exp.description}
                  </p>
                  <p className="text-xs text-usa-navy/40">{exp.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-usa-navy text-sm">
                    {currInfo?.symbol}
                    {exp.amount.toFixed(2)} {exp.currency}
                  </p>
                  {usdAmount !== null && exp.currency !== "USD" && (
                    <p className="text-xs text-usa-navy/40">
                      ≈ ${usdAmount.toFixed(2)}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  data-ocid={`tools.expense.delete_button.${idx + 1}`}
                  onClick={() => handleDelete(exp.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-usa-red/10 text-usa-red hover:bg-usa-red hover:text-white transition-all flex-shrink-0"
                  aria-label="Delete expense"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Main Tools Page ──────────────────────────────────────────────────────────
export default function Tools() {
  return (
    <div className="min-h-screen bg-usa-bg">
      {/* Header */}
      <header className="bg-usa-navy">
        <div className="h-3 bg-usa-red" />
        <div className="h-1 bg-white" />
        <div className="h-3 bg-usa-red" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <Calculator className="w-8 h-8 text-usa-gold" />
              <div>
                <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
                  Financial Tools
                </h1>
                <p className="text-white/60 mt-1">
                  Travel budgets, tip splitting, loan calculations & more
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="h-3 bg-usa-red" />
        <div className="h-1 bg-white" />
        <div className="h-3 bg-usa-red" />
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-usa-navy/20 overflow-hidden"
        >
          <Tabs defaultValue="travel">
            <div className="bg-usa-navy px-6 py-4">
              <TabsList className="bg-usa-navy-light w-full grid grid-cols-2 sm:grid-cols-4 gap-1 h-auto p-1">
                {[
                  { value: "travel", label: "Travel Budget", icon: Plane },
                  { value: "tip", label: "Tip Calculator", icon: DollarSign },
                  { value: "loan", label: "Loan Calculator", icon: TrendingUp },
                  { value: "expense", label: "Expense Tracker", icon: Wallet },
                ].map(({ value, label, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    data-ocid={`tools.${value}.tab`}
                    className="flex items-center gap-1.5 text-white/60 data-[state=active]:bg-usa-red data-[state=active]:text-white font-bold text-xs py-2 rounded-lg"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{label.split(" ")[0]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <TabsContent value="travel">
              <TravelBudgetTab />
            </TabsContent>
            <TabsContent value="tip">
              <TipCalculatorTab />
            </TabsContent>
            <TabsContent value="loan">
              <LoanCalculatorTab />
            </TabsContent>
            <TabsContent value="expense">
              <ExpenseTrackerTab />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
