// ============================================================
// GOOGLE ADSENSE INTEGRATION
// To activate AdSense, insert the following script tag in
// frontend/index.html inside the <head> section:
//
// <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
//      crossorigin="anonymous"></script>
//
// Replace ca-pub-XXXXXXXXXXXXXXXX with your actual AdSense publisher ID.
// Then replace data-ad-client and data-ad-slot values below with your real values.
// ============================================================

interface AdSlotProps {
  width: number;
  height: number;
  slotType?: "leaderboard" | "rectangle" | "banner";
  className?: string;
}

export default function AdSlot({
  width,
  height,
  slotType = "banner",
  className = "",
}: AdSlotProps) {
  const labels: Record<string, string> = {
    leaderboard: "Advertisement — Leaderboard (728×90)",
    rectangle: "Advertisement — Rectangle (300×250)",
    banner: "Advertisement — Banner",
  };

  return (
    <div
      className={`flex items-center justify-center border-2 border-dashed border-usa-navy/30 bg-usa-white/80 rounded ${className}`}
      style={{ width: "100%", maxWidth: width, minHeight: height }}
      data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
      data-ad-slot="XXXXXXXXXX"
      data-ad-format="auto"
      data-full-width-responsive="true"
    >
      <div className="text-center py-3 px-4">
        <p className="text-xs font-semibold text-usa-navy/40 uppercase tracking-widest">
          {labels[slotType]}
        </p>
        <p className="text-xs text-usa-navy/30 mt-1">
          {width} × {height}
        </p>
      </div>
    </div>
  );
}
