import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";

const NAV_ITEMS = [
  { label: "Главная", href: "/" },
  { label: "Наши проекты", href: "/projects" },
  { label: "Портфолио", href: "/#portfolio" },
  { label: "Услуги", href: "/#design" },
  { label: "О компании", href: "/#about" },
  { label: "Ипотека", href: "/#mortgage" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    if (href.startsWith("/#")) return false;
    return location.pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/96 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-medium tracking-widest uppercase text-foreground">
          АРКА
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            item.href.startsWith("/#") ? (
              <a
                key={item.href}
                href={item.href}
                className={`nav-link text-foreground/70 hover:text-foreground`}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                to={item.href}
                className={`nav-link ${isActive(item.href) ? "active text-foreground" : "text-foreground/70 hover:text-foreground"}`}
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>

        <div className="hidden lg:flex">
          <Link to="/#contacts" className="btn-primary text-xs py-2 px-5">
            Получить консультацию
          </Link>
        </div>

        <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={20} />
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-background border-t border-border px-6 py-4 flex flex-col gap-4 animate-fade-in">
          {NAV_ITEMS.map((item) => (
            item.href.startsWith("/#") ? (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-left nav-link text-sm py-1"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-left nav-link text-sm py-1"
              >
                {item.label}
              </Link>
            )
          ))}
        </div>
      )}
    </header>
  );
}
