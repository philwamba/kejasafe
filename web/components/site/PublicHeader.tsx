import Link from "next/link";

import { Logo } from "@/components/site/Logo";

export function PublicHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 rounded-full border border-stone-200 bg-white px-5 py-3">
      <Logo />
      <nav className="flex flex-wrap items-center gap-3 text-sm text-stone-600">
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
