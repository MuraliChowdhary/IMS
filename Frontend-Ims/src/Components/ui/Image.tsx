import React from "react";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

const Image = ({ src, alt, ...props }: ImageProps) => {
  return <img src={src} alt={alt} loading="lazy" {...props} />;
};

export default Image;
