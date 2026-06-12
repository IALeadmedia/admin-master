import { useState, forwardRef } from "react";
import React from "react";

interface IImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback: string;
}

export const Image = forwardRef<HTMLImageElement, IImageProps>(
  ({ src, alt, fallback, ...props }: IImageProps, ref) => {
    const [imgSrc, setImgSrc] = useState(src);

    return (
      <img
        ref={ref}
        src={imgSrc}
        alt={alt}
        onError={() => setImgSrc(fallback)}
        {...props}
      />
    );
  }
);
