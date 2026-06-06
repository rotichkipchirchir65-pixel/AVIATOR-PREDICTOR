/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";

interface AviatorLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  pulse?: boolean;
}

export const AviatorLogo: React.FC<AviatorLogoProps> = ({
  className = "",
  size = "md",
  pulse = false,
}) => {
  const sizeClasses = {
    sm: "w-16 h-12",
    md: "w-32 h-20",
    lg: "w-48 h-32",
    xl: "w-64 h-40",
  };

  return (
    <div
      id="aviator-logo-container"
      className={`relative flex items-center justify-center ${sizeClasses[size]} ${
        pulse ? "animate-pulse" : ""
      } ${className}`}
    >
      <svg
        viewBox="0 0 120 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(239,68,68,0.7)]"
      >
        {/* Propeller spinner line */}
        <path
          d="M100 12 L106 32"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinecap="round"
          className="origin-[103px_22px] animate-[spin_1.5s_linear_infinite]"
        />
        <path
          d="M106 12 L100 32"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinecap="round"
          className="origin-[103px_22px] animate-[spin_1.5s_linear_infinite]"
        />

        {/* Plane fuselage & wings */}
        <path
          d="M20 40 
             C24 38, 30 36, 40 33
             L75 22 
             C82 20, 92 18, 98 20
             C102 21, 104 23, 103 25
             C101 27, 95 29, 88 34
             L55 46
             C48 48, 40 48, 34 47
             Z"
          fill="#ef4444"
        />

        {/* Propeller cap nose */}
        <path
          d="M98 19 
             C101 19, 104 22, 104 24
             C104 26, 101 29, 98 29
             Z"
          fill="#991b1b"
        />

        {/* Back tail horizontal structure */}
        <path
          d="M25 38 
             L16 42
             C13 43, 12 41, 14 39
             L22 34
             Z"
          fill="#dc2626"
        />

        {/* Back tail vertical stabilizer - styled up */}
        <path
          d="M29 35 
             L21 16
             C20 14, 23 13, 25 15
             L34 30
             Z"
          fill="#ef4444"
        />

        {/* Tilted bottom wings wingtips */}
        <path
          d="M58 35 
             L50 56
             C49 58, 45 56, 46 53
             L56 32
             Z"
          fill="#b91c1c"
        />

        {/* Cockpit Canopy glass */}
        <path
          d="M72 23 
             C74 19, 81 18, 85 20
             L83 23
             Z"
          fill="#ffffff"
          opacity="0.8"
        />

        {/* Action accent lines showing wind stream behind plane */}
        <path
          d="M5 32 L15 32"
          stroke="#ef4444"
          strokeWidth="1.5"
          opacity="0.5"
          strokeDasharray="4 2"
        />
        <path
          d="M8 24 L18 24"
          stroke="#ef4444"
          strokeWidth="1.5"
          opacity="0.7"
          strokeDasharray="6 3"
        />
        <path
          d="M3 41 L12 41"
          stroke="#ef4444"
          strokeWidth="1"
          opacity="0.4"
          strokeDasharray="3 3"
        />
      </svg>
    </div>
  );
};
