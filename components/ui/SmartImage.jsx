"use client";

import Image from "next/image";


export default function SmartImage({ src, alt, className = "", ...rest }) {
  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.style.display = "none";
        e.currentTarget.parentElement?.classList?.add(
          "bg-gradient-to-br",
          "from-primary/20",
          "via-secondary/10",
          "to-accent/20"
        );
      }}
      {...rest}
    />
  );
}
