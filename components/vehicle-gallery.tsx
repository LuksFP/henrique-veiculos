"use client";

import { useState } from "react";
import { ShowroomLogo } from "@/components/showroom-logo";

interface GalleryImage {
  id: string;
  url: string;
}

interface Props {
  images: GalleryImage[];
  alt: string;
  year: number;
}

export function VehicleGallery({ images, alt, year }: Props) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="vp-gallery-wrap">
      <div className="vp-gallery-main">
        {current ? (
          <img src={current.url} alt={alt} />
        ) : (
          <ShowroomLogo />
        )}
        <span className="year-badge">{year}</span>
      </div>
      {images.length > 1 && (
        <div className="vp-gallery-thumbs">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              className={`vp-gallery-thumb${i === active ? " is-active" : ""}`}
              onClick={() => setActive(i)}
            >
              <img src={img.url} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
