"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type ProductImageProps = Omit<ImageProps, "onError" | "src"> & {
  fallbackSrc: string;
  src: string;
};

export function ProductImage({
  alt,
  fallbackSrc,
  src: productSrc,
  ...imageProps
}: ProductImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const src = failedSrc === productSrc ? fallbackSrc : productSrc;

  return (
    <Image
      {...imageProps}
      alt={alt}
      src={src}
      onError={() => setFailedSrc(productSrc)}
    />
  );
}

export default ProductImage;
