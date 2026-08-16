import { Link } from "@tanstack/react-router";

type SiteLogoProps = {
  className?: string;
  height?: number;
};

/** Logo officiel Help Life Building (public/logo2.png). */
export function SiteLogo({ className = "", height = 44 }: SiteLogoProps) {
  return (
    <Link to="/" className={`group inline-flex shrink-0 items-center ${className}`}>
      <img
        src="/logo2.png"
        alt="Help Life Building — Your life coaching"
        height={height}
        width={Math.round(height * 3.6)}
        className="block object-contain transition-transform duration-300 group-hover:-translate-y-0.5"
        style={{ height, width: "auto", maxWidth: Math.round(height * 3.6) }}
      />
    </Link>
  );
}
