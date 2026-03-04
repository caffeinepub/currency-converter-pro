import {
  BarChart3,
  CheckCircle2,
  Globe,
  RefreshCw,
  Shield,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ─── Quiz Data ─────────────────────────────────────────────────────────────────
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the mid-market exchange rate?",
    options: [
      "The rate banks charge retail customers",
      "The midpoint between buy and sell rates on global markets",
      "A fixed rate set by the government",
      "The rate used only for cryptocurrency",
    ],
    correctIndex: 1,
    explanation:
      "The mid-market rate (also called interbank rate) is the midpoint between the buy and sell rates on global currency markets — it's the fairest, most neutral rate.",
  },
  {
    id: 2,
    question: "Which factor does NOT directly affect exchange rates?",
    options: [
      "A country's interest rates",
      "Trade balance surplus/deficit",
      "The color of the country's flag",
      "Political stability",
    ],
    correctIndex: 2,
    explanation:
      "A country's flag has no bearing on its currency value. Interest rates, trade balance, and political stability are key drivers of exchange rate movements.",
  },
  {
    id: 3,
    question:
      "What happens to a currency's value when inflation rises significantly?",
    options: [
      "It typically strengthens",
      "It remains unchanged",
      "It typically weakens",
      "It automatically resets to 1:1",
    ],
    correctIndex: 2,
    explanation:
      "High inflation erodes purchasing power, which typically weakens a currency. Investors seek currencies with stable purchasing power.",
  },
  {
    id: 4,
    question: "What is a stablecoin?",
    options: [
      "A government-issued digital currency",
      "A cryptocurrency pegged to a stable asset like the US Dollar",
      "Bitcoin held in cold storage",
      "A currency that never fluctuates internationally",
    ],
    correctIndex: 1,
    explanation:
      "Stablecoins like USDT and USDC are cryptocurrencies designed to maintain a stable value by being pegged to a reference asset, usually the US Dollar.",
  },
  {
    id: 5,
    question:
      "Why do banks offer a different exchange rate than the mid-market rate?",
    options: [
      "It's illegal to use mid-market rates",
      "To add a profit margin (spread) on currency exchange",
      "Because their data is always wrong",
      "To help customers get better deals",
    ],
    correctIndex: 1,
    explanation:
      "Banks and exchange services add a 'spread' — the difference between the buy/sell rate and mid-market — as their profit margin. This is why the rate you get is always slightly worse than the mid-market rate.",
  },
];

// ─── Rate Factors Section ─────────────────────────────────────────────────────
const RATE_FACTORS = [
  {
    icon: TrendingUp,
    title: "Interest Rates",
    description:
      "Central banks set interest rates which attract or repel foreign investment. Higher rates tend to strengthen a currency by attracting capital seeking better returns.",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    iconColor: "text-blue-500",
  },
  {
    icon: BarChart3,
    title: "Inflation",
    description:
      "Countries with lower inflation typically see their currency appreciate. High inflation erodes purchasing power and makes exports less competitive, weakening the currency.",
    color: "bg-red-50 border-red-200 text-red-700",
    iconColor: "text-red-500",
  },
  {
    icon: Globe,
    title: "Trade Balance",
    description:
      "Countries that export more than they import (trade surplus) have higher demand for their currency. A trade deficit can weaken currency as more foreign currency is needed.",
    color: "bg-green-50 border-green-200 text-green-700",
    iconColor: "text-green-500",
  },
  {
    icon: Shield,
    title: "Political Stability",
    description:
      "Stable governments attract foreign investment. Political turmoil, elections, and policy uncertainty drive investors to safer currencies like USD, EUR, and CHF.",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    iconColor: "text-purple-500",
  },
  {
    icon: RefreshCw,
    title: "Market Speculation",
    description:
      "Currency traders and hedge funds can move markets significantly through speculation. Sentiment, news events, and technical analysis drive trillions in daily forex volume.",
    color: "bg-amber-50 border-amber-200 text-amber-700",
    iconColor: "text-amber-500",
  },
];

// ─── Quiz Component ────────────────────────────────────────────────────────────
function Quiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(QUIZ_QUESTIONS.length).fill(null),
  );
  const [showResults, setShowResults] = useState(false);

  const question = QUIZ_QUESTIONS[currentQ];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.correctIndex;

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(answers[currentQ + 1]);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setAnswers(new Array(QUIZ_QUESTIONS.length).fill(null));
    setShowResults(false);
  };

  const score = answers.filter(
    (a, i) => a === QUIZ_QUESTIONS[i].correctIndex,
  ).length;

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4 p-6"
      >
        <div className="text-6xl font-display font-black text-usa-navy">
          {score}/{QUIZ_QUESTIONS.length}
        </div>
        <p className="text-lg font-bold text-usa-navy">
          {score === QUIZ_QUESTIONS.length
            ? "🏆 Perfect Score! You're a currency expert!"
            : score >= 3
              ? "🌟 Great job! You know your currencies."
              : "📚 Keep learning — you'll get there!"}
        </p>
        <div className="flex justify-center gap-3">
          {QUIZ_QUESTIONS.map((q, i) => (
            <span
              key={q.id}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                answers[i] === q.correctIndex ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {i + 1}
            </span>
          ))}
        </div>
        <button
          type="button"
          data-ocid="learn.quiz.primary_button"
          onClick={handleReset}
          className="mt-4 px-6 py-3 min-h-[48px] bg-usa-red text-white font-bold rounded-xl hover:bg-usa-red/85 transition-colors"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-2">
        {QUIZ_QUESTIONS.map((q, i) => (
          <div
            key={q.id}
            className={`flex-1 h-2 rounded-full transition-colors ${
              i < currentQ
                ? answers[i] === QUIZ_QUESTIONS[i].correctIndex
                  ? "bg-green-500"
                  : "bg-red-400"
                : i === currentQ
                  ? "bg-usa-red"
                  : "bg-usa-navy/15"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-usa-navy/50 font-bold uppercase tracking-wider">
        Question {currentQ + 1} of {QUIZ_QUESTIONS.length}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          <h3 className="font-display font-bold text-xl text-usa-navy leading-snug">
            {question.question}
          </h3>

          <div className="space-y-2">
            {question.options.map((option, idx) => {
              let btnClass =
                "w-full text-left px-5 py-3.5 min-h-[52px] rounded-xl font-medium text-sm border-2 transition-all ";
              if (!isAnswered) {
                btnClass +=
                  "bg-white border-usa-navy/20 text-usa-navy hover:border-usa-red hover:bg-usa-red/5";
              } else if (idx === question.correctIndex) {
                btnClass +=
                  "bg-green-50 border-green-400 text-green-800 font-bold";
              } else if (idx === selectedAnswer) {
                btnClass += "bg-red-50 border-red-400 text-red-800";
              } else {
                btnClass += "bg-usa-bg border-usa-navy/10 text-usa-navy/40";
              }

              return (
                <button
                  key={option}
                  type="button"
                  data-ocid={`learn.quiz.item.${idx + 1}`}
                  onClick={() => handleAnswer(idx)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                    {isAnswered && idx === question.correctIndex && (
                      <CheckCircle2 className="w-4 h-4 ml-auto text-green-500 flex-shrink-0" />
                    )}
                    {isAnswered &&
                      idx === selectedAnswer &&
                      idx !== question.correctIndex && (
                        <XCircle className="w-4 h-4 ml-auto text-red-500 flex-shrink-0" />
                      )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`rounded-xl px-5 py-4 text-sm font-medium ${
                  isCorrect
                    ? "bg-green-50 border-2 border-green-200 text-green-800"
                    : "bg-amber-50 border-2 border-amber-200 text-amber-800"
                }`}
              >
                <p className="font-bold mb-1">
                  {isCorrect ? "✅ Correct!" : "❌ Not quite."}
                </p>
                <p>{question.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {isAnswered && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          type="button"
          data-ocid="learn.quiz.secondary_button"
          onClick={handleNext}
          className="w-full min-h-[52px] bg-usa-red text-white font-bold rounded-xl hover:bg-usa-red/85 transition-colors text-lg"
        >
          {currentQ < QUIZ_QUESTIONS.length - 1
            ? "Next Question →"
            : "See Results"}
        </motion.button>
      )}
    </div>
  );
}

// ─── Main Learn Page ──────────────────────────────────────────────────────────
export default function Learn() {
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
            <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
              Currency Education Hub
            </h1>
            <p className="text-white/60 mt-1">
              Learn how exchange rates work and become a smarter global traveler
            </p>
          </motion.div>
        </div>
        <div className="h-3 bg-usa-red" />
        <div className="h-1 bg-white" />
        <div className="h-3 bg-usa-red" />
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Section 1: Rate Factors */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-usa-red rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-display font-bold text-2xl text-usa-navy">
              What Affects Exchange Rates
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RATE_FACTORS.map((factor, idx) => (
              <motion.div
                key={factor.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`rounded-xl p-5 border-2 ${factor.color}`}
              >
                <factor.icon className={`w-7 h-7 mb-3 ${factor.iconColor}`} />
                <h3 className="font-display font-bold text-lg mb-2">
                  {factor.title}
                </h3>
                <p className="text-sm leading-relaxed opacity-85">
                  {factor.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section 2: Bank Markups */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-usa-navy/20 overflow-hidden"
        >
          <div className="bg-usa-navy px-6 py-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-usa-gold rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-usa-navy" />
            </div>
            <h2 className="font-display font-bold text-xl text-white">
              How Banks Mark Up Exchange Rates
            </h2>
          </div>
          <div className="p-6 space-y-5">
            <div className="bg-usa-bg rounded-xl p-5 border-2 border-usa-navy/10">
              <p className="font-bold text-usa-navy mb-2">
                Example: Converting $1,000 USD to EUR
              </p>
              <p className="text-sm text-usa-navy/70 leading-relaxed">
                Suppose the mid-market rate is{" "}
                <strong>1 USD = 0.9201 EUR</strong>. If you convert $1,000, at
                the true rate you'd get <strong>€920.10</strong>. But here's
                what actually happens:
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-usa-navy text-white">
                    <th className="px-4 py-3 text-left font-bold">Service</th>
                    <th className="px-4 py-3 text-center font-bold">
                      Rate Used
                    </th>
                    <th className="px-4 py-3 text-right font-bold">
                      You Receive
                    </th>
                    <th className="px-4 py-3 text-right font-bold">You Lose</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      service: "Mid-market (true)",
                      rate: "0.9201",
                      receive: "€920.10",
                      lose: "€0",
                      highlight: true,
                    },
                    {
                      service: "Online Transfer (Wise)",
                      rate: "0.9156 (0.5% fee)",
                      receive: "€915.60",
                      lose: "€4.50",
                      highlight: false,
                    },
                    {
                      service: "High Street Bank",
                      rate: "0.8925 (3% markup)",
                      receive: "€892.50",
                      lose: "€27.60",
                      highlight: false,
                    },
                    {
                      service: "Airport Exchange",
                      rate: "0.8280 (10% markup)",
                      receive: "€828.00",
                      lose: "€92.10",
                      highlight: false,
                    },
                  ].map((row) => (
                    <tr
                      key={row.service}
                      className={`border-b border-usa-navy/8 ${row.highlight ? "bg-green-50" : "hover:bg-usa-bg"}`}
                    >
                      <td
                        className={`px-4 py-3 font-bold ${row.highlight ? "text-green-700" : "text-usa-navy"}`}
                      >
                        {row.service}
                      </td>
                      <td className="px-4 py-3 text-center text-usa-navy/70 font-mono text-xs">
                        {row.rate}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-usa-navy">
                        {row.receive}
                      </td>
                      <td
                        className={`px-4 py-3 text-right font-bold ${row.lose === "€0" ? "text-green-600" : "text-red-600"}`}
                      >
                        {row.lose}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-usa-navy/50 bg-amber-50 border border-amber-200 rounded-lg p-3">
              💡 <strong>Tip:</strong> Always compare to the mid-market rate
              before exchanging money. Services like Wise and Revolut offer
              rates much closer to the real rate.
            </p>
          </div>
        </motion.section>

        {/* Section 3: Fiat vs Crypto vs Stablecoins */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-usa-navy rounded-xl flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-usa-gold" />
            </div>
            <h2 className="font-display font-bold text-2xl text-usa-navy">
              Fiat vs. Crypto vs. Stablecoins
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: "Fiat Currency",
                emoji: "🏛️",
                examples: "USD, EUR, GBP, JPY",
                pros: [
                  "Government backed",
                  "Universally accepted",
                  "Relatively stable",
                  "FDIC/government insured",
                ],
                cons: [
                  "Inflation erodes value",
                  "Central bank control",
                  "Slow international transfers",
                  "Banking fees",
                ],
                color: "border-blue-300 bg-blue-50",
                headerColor: "bg-blue-700",
              },
              {
                title: "Cryptocurrency",
                emoji: "₿",
                examples: "BTC, ETH, SOL, DOGE",
                pros: [
                  "Decentralized",
                  "Borderless transfers",
                  "Transparent blockchain",
                  "Inflation-resistant supply",
                ],
                cons: [
                  "High volatility",
                  "Regulatory uncertainty",
                  "Technical complexity",
                  "No central protection",
                ],
                color: "border-amber-300 bg-amber-50",
                headerColor: "bg-amber-600",
              },
              {
                title: "Stablecoins",
                emoji: "🔒",
                examples: "USDT, USDC, DAI",
                pros: [
                  "Price stability (pegged)",
                  "Fast transfers",
                  "DeFi compatible",
                  "Near-zero fees",
                ],
                cons: [
                  "Centralized issuers",
                  "Counterparty risk",
                  "Regulatory scrutiny",
                  "Not truly decentralized",
                ],
                color: "border-green-300 bg-green-50",
                headerColor: "bg-green-700",
              },
            ].map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`rounded-2xl border-2 overflow-hidden ${card.color}`}
              >
                <div className={`${card.headerColor} px-5 py-4`}>
                  <div className="text-3xl mb-1">{card.emoji}</div>
                  <h3 className="font-display font-bold text-lg text-white">
                    {card.title}
                  </h3>
                  <p className="text-white/70 text-xs">{card.examples}</p>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">
                      ✓ Pros
                    </p>
                    <ul className="space-y-1">
                      {card.pros.map((pro) => (
                        <li
                          key={pro}
                          className="text-xs text-green-800 flex items-center gap-1.5"
                        >
                          <span className="text-green-500">•</span> {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">
                      ✗ Cons
                    </p>
                    <ul className="space-y-1">
                      {card.cons.map((con) => (
                        <li
                          key={con}
                          className="text-xs text-red-800 flex items-center gap-1.5"
                        >
                          <span className="text-red-500">•</span> {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section 4: Quiz */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-usa-navy/20 overflow-hidden"
        >
          <div className="bg-usa-red px-6 py-4 flex items-center gap-3">
            <div className="text-2xl">🧠</div>
            <div>
              <h2 className="font-display font-bold text-xl text-white">
                Currency Knowledge Quiz
              </h2>
              <p className="text-white/70 text-xs mt-0.5">
                Test your understanding of exchange rates and global finance
              </p>
            </div>
          </div>
          <Quiz />
        </motion.section>
      </div>
    </div>
  );
}
