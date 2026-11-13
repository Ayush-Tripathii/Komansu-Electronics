"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { useAperture } from "./Aperture";

type Props = React.ComponentPropsWithoutRef<typeof Link> & { href: string };

export const TransitionLink = forwardRef<HTMLAnchorElement, Props>(function TransitionLink(
  { href, onClick, children, ...rest },
  ref
) {
  const { navigate } = useAperture();
  return (
    <Link
      ref={ref}
      href={href}
      data-cursor={rest["data-cursor" as keyof typeof rest] ?? "link"}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (
          e.defaultPrevented ||
          e.button !== 0 ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          rest.target === "_blank" ||
          /^(https?:|mailto:|tel:)/.test(href)
        )
          return;
        e.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </Link>
  );
});
