import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Plus, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { convertCurrency, useExchangeRates } from "../hooks/useExchangeRates";
import { ALL_CURRENCIES, CURRENCY_MAP } from "../lib/currencies";

interface RateAlert {
  id: string;
  fromCode: string;
  toCode: string;
  targetRate: number;
  direction: "above" | "below";
  status: "pending" | "triggered";
  createdAt: string;
}

const ALERTS_KEY = "ccp_alerts";
const MAX_ALERTS = 10;

function loadAlerts(): RateAlert[] {
  try {
    const raw = localStorage.getItem(ALERTS_KEY);
    return raw ? (JSON.parse(raw) as RateAlert[]) : [];
  } catch {
    return [];
  }
}

function saveAlerts(alerts: RateAlert[]) {
  try {
    localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
  } catch {
    // ignore
  }
}

export default function Alerts() {
  const { rates, isLoading } = useExchangeRates();
  const [alerts, setAlerts] = useState<RateAlert[]>(() => loadAlerts());

  // Form state
  const [fromCode, setFromCode] = useState("USD");
  const [toCode, setToCode] = useState("EUR");
  const [targetRate, setTargetRate] = useState("");
  const [direction, setDirection] = useState<"above" | "below">("above");

  const availableCodes = ALL_CURRENCIES.map((c) => c.code);

  // Check alerts against current rates
  useEffect(() => {
    if (isLoading || Object.keys(rates).length === 0) return;

    setAlerts((prev) => {
      const updated = prev.map((alert) => {
        if (alert.status === "triggered") return alert;
        const currentRate = convertCurrency(
          1,
          alert.fromCode,
          alert.toCode,
          rates,
        );
        if (currentRate === null) return alert;
        const triggered =
          alert.direction === "above"
            ? currentRate >= alert.targetRate
            : currentRate <= alert.targetRate;
        if (triggered) {
          toast.success(
            `🔔 Alert: ${alert.fromCode}/${alert.toCode} is ${alert.direction} ${alert.targetRate}!`,
            { duration: 6000 },
          );
          return { ...alert, status: "triggered" as const };
        }
        return alert;
      });
      saveAlerts(updated);
      return updated;
    });
  }, [rates, isLoading]);

  const handleAddAlert = () => {
    if (alerts.length >= MAX_ALERTS) {
      toast.error(`Maximum ${MAX_ALERTS} alerts allowed`);
      return;
    }
    const rate = Number.parseFloat(targetRate);
    if (Number.isNaN(rate) || rate <= 0) {
      toast.error("Please enter a valid target rate");
      return;
    }
    if (fromCode === toCode) {
      toast.error("From and To currencies must be different");
      return;
    }

    const newAlert: RateAlert = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      fromCode,
      toCode,
      targetRate: rate,
      direction,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const updated = [...alerts, newAlert];
    setAlerts(updated);
    saveAlerts(updated);
    setTargetRate("");
    toast.success(`Alert set: ${fromCode}/${toCode} ${direction} ${rate}`);
  };

  const handleDelete = (id: string) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    saveAlerts(updated);
    toast.success("Alert deleted");
  };

  const currentRate =
    !isLoading && rates[fromCode] && rates[toCode]
      ? convertCurrency(1, fromCode, toCode, rates)
      : null;

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
              <Bell className="w-8 h-8 text-usa-gold" />
              <div>
                <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
                  Rate Alerts
                </h1>
                <p className="text-white/60 mt-1">
                  Get notified when exchange rates hit your target
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="h-3 bg-usa-red" />
        <div className="h-1 bg-white" />
        <div className="h-3 bg-usa-red" />
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Create Alert Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-usa-navy/20 overflow-hidden"
        >
          <div className="bg-usa-navy px-6 py-4 flex items-center gap-3">
            <Plus className="w-5 h-5 text-usa-gold" />
            <h2 className="font-display font-bold text-xl text-white">
              Create Alert
            </h2>
            <span className="ml-auto text-white/50 text-xs">
              {alerts.length}/{MAX_ALERTS} alerts
            </span>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="alerts-from"
                  className="text-xs font-bold text-usa-navy/60 uppercase tracking-widest"
                >
                  From Currency
                </label>
                <select
                  id="alerts-from"
                  data-ocid="alerts.from_select"
                  value={fromCode}
                  onChange={(e) => setFromCode(e.target.value)}
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
                  htmlFor="alerts-to"
                  className="text-xs font-bold text-usa-navy/60 uppercase tracking-widest"
                >
                  To Currency
                </label>
                <select
                  id="alerts-to"
                  data-ocid="alerts.to_select"
                  value={toCode}
                  onChange={(e) => setToCode(e.target.value)}
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
            </div>

            {/* Current rate hint */}
            {currentRate !== null && (
              <p className="text-xs text-usa-navy/50 bg-usa-bg rounded-lg px-3 py-2">
                Current rate: 1 {fromCode} ={" "}
                <strong>{currentRate.toFixed(6)}</strong> {toCode}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="alerts-rate"
                  className="text-xs font-bold text-usa-navy/60 uppercase tracking-widest"
                >
                  Target Rate
                </label>
                <input
                  id="alerts-rate"
                  type="number"
                  step="any"
                  min="0"
                  data-ocid="alerts.rate_input"
                  value={targetRate}
                  onChange={(e) => setTargetRate(e.target.value)}
                  placeholder="e.g. 1.10"
                  className="w-full min-h-[48px] px-4 border-2 border-usa-navy/30 rounded-xl font-bold text-usa-navy focus:outline-none focus:border-usa-red"
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-usa-navy/60 uppercase tracking-widest block">
                  Direction
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    data-ocid="alerts.direction_toggle"
                    onClick={() => setDirection("above")}
                    className={`flex-1 min-h-[48px] rounded-xl font-bold text-sm border-2 transition-all ${
                      direction === "above"
                        ? "bg-green-600 text-white border-green-500"
                        : "bg-white text-usa-navy/60 border-usa-navy/20 hover:border-green-400"
                    }`}
                  >
                    ↑ Above
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirection("below")}
                    className={`flex-1 min-h-[48px] rounded-xl font-bold text-sm border-2 transition-all ${
                      direction === "below"
                        ? "bg-red-600 text-white border-red-500"
                        : "bg-white text-usa-navy/60 border-usa-navy/20 hover:border-red-400"
                    }`}
                  >
                    ↓ Below
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="button"
              data-ocid="alerts.add_button"
              onClick={handleAddAlert}
              disabled={alerts.length >= MAX_ALERTS}
              className="w-full min-h-[52px] bg-usa-red hover:bg-usa-red/85 text-white font-bold text-base rounded-xl"
            >
              <Bell className="w-5 h-5 mr-2" />
              Set Alert
            </Button>
          </div>
        </motion.div>

        {/* Alerts List */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-usa-navy/20 overflow-hidden"
        >
          <div className="bg-usa-navy px-6 py-4 flex items-center gap-3">
            <Bell className="w-5 h-5 text-usa-gold" />
            <h2 className="font-display font-bold text-xl text-white">
              Active Alerts
            </h2>
          </div>
          <div>
            {alerts.length === 0 ? (
              <div
                data-ocid="alerts.empty_state"
                className="px-6 py-12 text-center"
              >
                <BellOff className="w-10 h-10 text-usa-navy/20 mx-auto mb-3" />
                <p className="font-bold text-usa-navy/40">No alerts set yet</p>
                <p className="text-sm text-usa-navy/30 mt-1">
                  Create your first alert above
                </p>
              </div>
            ) : (
              <AnimatePresence>
                {alerts.map((alert, idx) => {
                  const fromInfo = CURRENCY_MAP[alert.fromCode];
                  const toInfo = CURRENCY_MAP[alert.toCode];
                  const ocidIdx = idx + 1;
                  return (
                    <motion.div
                      key={alert.id}
                      data-ocid={`alerts.item.${ocidIdx}`}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 16 }}
                      transition={{ duration: 0.2, delay: idx * 0.04 }}
                      className={`flex items-center gap-4 px-6 py-4 border-b border-usa-navy/8 last:border-b-0 hover:bg-usa-bg/50 transition-colors ${
                        alert.status === "triggered" ? "opacity-60" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xl">
                          {fromInfo?.flag ?? "🌐"}
                        </span>
                        <span className="text-usa-navy/30">→</span>
                        <span className="text-xl">{toInfo?.flag ?? "🌐"}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-usa-navy text-sm">
                          {alert.fromCode} / {alert.toCode}
                        </p>
                        <p className="text-xs text-usa-navy/50">
                          {alert.direction === "above" ? "↑ Above" : "↓ Below"}{" "}
                          <strong>{alert.targetRate}</strong>
                        </p>
                      </div>
                      <Badge
                        variant={
                          alert.status === "triggered"
                            ? "destructive"
                            : "outline"
                        }
                        className={
                          alert.status === "triggered"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "border-usa-navy/30 text-usa-navy/60"
                        }
                      >
                        {alert.status === "triggered"
                          ? "✓ Triggered"
                          : "Pending"}
                      </Badge>
                      <button
                        type="button"
                        data-ocid={`alerts.delete_button.${ocidIdx}`}
                        onClick={() => handleDelete(alert.id)}
                        className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-usa-red/10 text-usa-red hover:bg-usa-red hover:text-white transition-all"
                        aria-label="Delete alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        {/* Info note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-usa-navy/5 border border-usa-navy/15 rounded-xl p-4 text-xs text-usa-navy/50"
        >
          <strong>Note:</strong> Alerts are stored in your browser and checked
          when rates are loaded. You must have this page open to receive
          notifications. For push notifications, upgrade to a future premium
          plan.
        </motion.div>
      </div>
    </div>
  );
}
