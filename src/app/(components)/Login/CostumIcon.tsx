import * as React from "react";
import SvgIcon from "@mui/material/SvgIcon";

export function SitemarkIcon() {
  return (
    <svg
      width="320"
      height="140"
      viewBox="0 0 320 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="url(#cube-gradient)"
        d="M60 20L20 40v40l40 20 40-20V40L60 20Z"
      />
      <path fill="url(#cube-side)" d="M60 20v40l40-20V20L60 20Z" />

      <rect
        x="20"
        y="45"
        width="50"
        height="3"
        fill="rgba(176, 176, 176, 0.80)"
        opacity="0.8"
      >
        <animate
          attributeName="y"
          values="45;75;45"
          dur="3s"
          repeatCount="indefinite"
        />
      </rect>

      <rect
        x="40"
        y="50"
        width="8"
        height="8"
        rx="1"
        fill="#FFD166"
        transform="rotate(15 40 50)"
      >
        <animate
          attributeName="y"
          values="50;55;50"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>
      <circle cx="70" cy="45" r="4" fill="#FF6B6B">
        <animate
          attributeName="cx"
          values="70;72;70"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </circle>
      <path d="M50 70l5-5 3 3-5 5-3-3Z" fill="#00D3AB">
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 50 70; 5 50 70; 0 50 70"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>

      <circle cx="35" cy="50" r="2" fill="#4876EE" />
      <circle cx="70" cy="65" r="2" fill="#4876EE" />
      <circle cx="50" cy="80" r="2" fill="#4876EE" />

      <text
        x="120"
        y="67"
        font-family="Arial, sans-serif"
        font-size="18"
        fill="#2D3748"
        font-weight="bold"
      >
        <tspan fill="#4876EE">Inventory</tspan>
        <tspan fill="#ccc9" dx="10">
          Scan
        </tspan>
      </text>

      <defs width="50%">
        <linearGradient id="cube-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ccc" />
          <stop offset="100%" stop-color="#ccc" />
        </linearGradient>
        <linearGradient id="cube-side" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4876EE" stop-opacity="0.6" />
          <stop offset="100%" stop-color="#00D3AB" stop-opacity="0.6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FacebookIcon() {
  return (
    <SvgIcon>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.68 15.92C2.88 15.24 0 11.96 0 8C0 3.6 3.6 0 8 0C12.4 0 16 3.6 16 8C16 11.96 13.12 15.24 9.32 15.92L8.88 15.56H7.12L6.68 15.92Z"
          fill="url(#paint0_linear_795_116)"
        />
        <path
          d="M11.12 10.2391L11.48 7.99914H9.36V6.43914C9.36 5.79914 9.6 5.31914 10.56 5.31914H11.6V3.27914C11.04 3.19914 10.4 3.11914 9.84 3.11914C8 3.11914 6.72 4.23914 6.72 6.23914V7.99914H4.72V10.2391H6.72V15.8791C7.16 15.9591 7.6 15.9991 8.04 15.9991C8.48 15.9991 8.92 15.9591 9.36 15.8791V10.2391H11.12Z"
          fill="white"
        />
        <defs>
          <linearGradient
            id="paint0_linear_795_116"
            x1="8"
            y1="0"
            x2="8"
            y2="15.9991"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1AAFFF" />
            <stop offset="1" stopColor="#0163E0" />
          </linearGradient>
        </defs>
      </svg>
    </SvgIcon>
  );
}

export function GoogleIcon() {
  return (
    <SvgIcon>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.68 8.18182C15.68 7.61455 15.6291 7.06909 15.5345 6.54545H8V9.64364H12.3055C12.1164 10.64 11.5491 11.4836 10.6982 12.0509V14.0655H13.2945C14.8073 12.6691 15.68 10.6182 15.68 8.18182Z"
          fill="#4285F4"
        />
        <path
          d="M8 16C10.16 16 11.9709 15.2873 13.2945 14.0655L10.6982 12.0509C9.98545 12.5309 9.07636 12.8218 8 12.8218C5.92 12.8218 4.15273 11.4182 3.52 9.52727H0.858182V11.5927C2.17455 14.2036 4.87273 16 8 16Z"
          fill="#34A853"
        />
        <path
          d="M3.52 9.52C3.36 9.04 3.26545 8.53091 3.26545 8C3.26545 7.46909 3.36 6.96 3.52 6.48V4.41455H0.858182C0.312727 5.49091 0 6.70545 0 8C0 9.29455 0.312727 10.5091 0.858182 11.5855L2.93091 9.97091L3.52 9.52Z"
          fill="#FBBC05"
        />
        <path
          d="M8 3.18545C9.17818 3.18545 10.2255 3.59273 11.0618 4.37818L13.3527 2.08727C11.9636 0.792727 10.16 0 8 0C4.87273 0 2.17455 1.79636 0.858182 4.41455L3.52 6.48C4.15273 4.58909 5.92 3.18545 8 3.18545Z"
          fill="#EA4335"
        />
      </svg>
    </SvgIcon>
  );
}
