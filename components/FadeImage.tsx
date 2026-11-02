"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/** A photo that fades in once loaded, instead of popping onto the page. */
export default function FadeImage({ className = "", onLoad, alt, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      {...props}
      alt={alt}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      className={`${className} ${loaded ? "" : "opacity-0"}`}
    />
  );
}
