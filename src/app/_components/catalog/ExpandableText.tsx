"use client";

import { useState } from "react";

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
}

export function ExpandableText({ text, maxLength = 300 }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  const shouldTruncate = text.length > maxLength;
  const displayText = expanded || !shouldTruncate ? text : text.slice(0, maxLength) + "...";

  return (
    <div className="text-white-600 mb-6">
      <p>{displayText}</p>
      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:underline mt-2"
        >
          {expanded ? "Скрыть" : "Читать полностью"}
        </button>
      )}
    </div>
  );
}
