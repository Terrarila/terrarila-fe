"use client";

import { useId } from "react";
import styles from "./contact-icon.module.css";

type Channel = "Instagram" | "Messenger";
const messengerPath =
  "M12 0C5.24 0 0 4.97 0 11.58c0 3.46 1.37 6.45 3.6 8.53.19.17.31.41.32.67l.07 2.14a.96.96 0 0 0 1.35.85l2.38-1.05a.96.96 0 0 1 .64-.05c1.15.32 2.37.49 3.64.49 6.76 0 12-4.97 12-11.58S18.76 0 12 0ZM4.79 14.97l3.52-5.59a1.8 1.8 0 0 1 2.6-.48l2.8 2.1a.72.72 0 0 0 .87 0l3.78-2.87c.5-.38 1.16.22.82.75l-3.52 5.59a1.8 1.8 0 0 1-2.6.48l-2.8-2.1a.72.72 0 0 0-.87 0l-3.78 2.87c-.5.38-1.16-.22-.82-.75Z";

function Mark({ channel, color }: { channel: Channel; color: string }) {
  return channel === "Messenger" ? (
    <path fill={color} fillRule="evenodd" d={messengerPath} />
  ) : (
    <g fill="none" stroke={color} strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none" />
    </g>
  );
}

export function ContactIcon({ channel }: { channel: Channel }) {
  // Each icon instance gets its own gradient ID, including footer + related-product cards.
  const gradientId = useId();
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      {channel === "Instagram" ? (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFD600" />
            <stop offset="25%" stopColor="#FF7A00" />
            <stop offset="50%" stopColor="#FF0169" />
            <stop offset="75%" stopColor="#D300C5" />
            <stop offset="100%" stopColor="#7638FA" />
          </linearGradient>
        </defs>
      ) : null}
      <g className={styles.monochrome}>
        <Mark channel={channel} color="currentColor" />
      </g>
      <g className={styles.signature}>
        <Mark
          channel={channel}
          color={channel === "Instagram" ? `url(#${gradientId})` : "#0866FF"}
        />
      </g>
    </svg>
  );
}
