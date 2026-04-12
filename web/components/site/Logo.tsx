import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string | null;
  size?: number;
  showWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
}

export function Logo({
  href = "/",
  size = 32,
  showWordmark = true,
  className,
  wordmarkClassName,
}: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/logo.png"
        alt="Kejasafe"
        width={size}
        height={size}
        priority
        className="h-auto w-auto"
        style={{ width: size, height: size }}
      />
      {showWordmark ? (
        <span
          className={cn(
            "text-sm font-semibold tracking-[0.24em] text-orange-600",
            wordmarkClassName,
          )}
        >
          KEJASAFE
        </span>
      ) : null}
    </span>
  );

  if (!href) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}
