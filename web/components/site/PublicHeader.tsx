import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
      <Link href="/" className="text-sm font-semibold tracking-[0.24em] text-emerald-300">
        KEJASAFE
      </Link>
      <nav className="flex flex-wrap items-center gap-3 text-sm text-stone-300">
        <Link href="/properties">Listings</Link>
        <Link href="/search">Search</Link>
        <Link href="/about">About</Link>
        <Link href="/blog">Insights</Link>
        <Link href="/faq">FAQ</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/login">Login</Link>
      </nav>
    </header>
  );
}
