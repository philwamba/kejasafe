import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="mt-12 rounded-[32px] border border-white/10 bg-white/5 p-6 text-sm text-stone-300 backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold tracking-[0.24em] text-emerald-300">KEJASAFE</p>
          <p className="mt-2 max-w-2xl leading-7 text-stone-400">
            A modern property, housing, and tenant operations platform built for scalable public discovery and operational workflows.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-stone-300">
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/cookies">Cookies</Link>
          <Link href="/legal/acceptable-use">Acceptable Use</Link>
        </div>
      </div>
    </footer>
  );
}
