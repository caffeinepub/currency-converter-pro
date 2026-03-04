import { Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== "undefined"
      ? window.location.hostname
      : "currency-converter-pro",
  );

  return (
    <footer className="bg-usa-navy text-usa-white">
      {/* Stars stripe decoration */}
      <div className="h-2 bg-usa-red" />
      <div className="h-1 bg-usa-white" />
      <div className="h-2 bg-usa-red" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/usa-flag-icon.dim_64x64.png"
                alt="USA Flag"
                className="w-10 h-7 object-cover rounded-sm shadow"
              />
              <span className="font-display font-bold text-xl text-usa-gold tracking-wide">
                Currency Converter Pro
              </span>
            </div>
            <p className="text-usa-white/70 text-sm text-center md:text-left">
              Free Global Currency Conversion for Everyone
            </p>
          </div>

          {/* Stars decoration */}
          <div className="text-usa-gold text-2xl tracking-widest select-none hidden md:block">
            ★ ★ ★ ★ ★
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-end gap-2 text-sm text-usa-white/70">
            <p>© {year} Currency Converter Pro. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Built with <Heart className="w-4 h-4 text-usa-red fill-usa-red" />{" "}
              using{" "}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-usa-gold hover:underline font-semibold"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>

        {/* Bottom stripe */}
        <div className="mt-8 pt-4 border-t border-usa-navy-light text-center text-xs text-usa-white/50">
          <p>
            Exchange rates are for informational purposes only. Rates are
            approximate and may not reflect real-time market values.
          </p>
        </div>
      </div>

      {/* Bottom stripe decoration */}
      <div className="h-2 bg-usa-red" />
    </footer>
  );
}
