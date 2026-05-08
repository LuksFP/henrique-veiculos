"use client";

import { useState } from "react";

export function ImagePreview({
  currentUrl,
  inputStyle,
}: {
  currentUrl?: string | null;
  inputStyle?: React.CSSProperties;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {(preview || currentUrl) && (
        <img
          src={preview ?? currentUrl!}
          alt="Preview"
          className="h-36 w-52 rounded-lg object-cover"
          style={{ border: "1px solid var(--border)" }}
        />
      )}
      <input
        name="image"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="text-sm"
        style={inputStyle}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setPreview(URL.createObjectURL(file));
          else setPreview(null);
        }}
      />
    </div>
  );
}
