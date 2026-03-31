import type { ReactNode } from "react";

interface ContentSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function ContentSection({
  title,
  description,
  children,
}: ContentSectionProps) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-300">{description}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}
