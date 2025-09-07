import React from "react";
export default function PolaroidFrame({
  width = 360,
  height = 432, // Classic ~3.5x4.2 ratio
  frameColor = "#ffffff",
  cornerRadius = 24,
  borderShadow = true,
  label,
  labelProps = "text-sm tracking-wide text-black/70"
}: {
  width?: number;
  height?: number;
  frameColor?: string;
  cornerRadius?: number;
  borderShadow?: boolean;
  label?: string;
  labelProps?: string;
}) {
  // SVG design space: 700 x 840 (scales proportionally)
  const vbW = 700;
  const vbH = 840;

  // Interior photo window margins (top/left/right small, bottom large for polaroid look)
  const m = 40; // side & top margin
  const bottomThick = 190; // thick bottom margin for caption area

  const innerX = m;
  const innerY = m;
  const innerW = vbW - m * 2;
  const innerH = vbH - (m + bottomThick);
  const labelY = vbH - bottomThick / 2 + 10;

  return (
    <div
      className="relative"
      style={{ width, height }}
      aria-label="Polaroid frame cutout"
    >
      <svg
        viewBox={`0 0 ${vbW} ${vbH}`}
        width={width}
        height={height}
        className="block"
        role="img"
        aria-hidden={label ? undefined : true}
      >
        {/* Drop shadow for depth */}
        <defs>
          <filter id="pf-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* The frame ring. Uses evenodd fill to punch a TRANSPARENT hole. */}
        <path
          d={`
            M 0 0
            H ${vbW}
            V ${vbH}
            H 0
            Z
            M ${innerX} ${innerY}
            H ${innerX + innerW}
            V ${innerY + innerH}
            H ${innerX}
            Z
          `}
          fill={frameColor}
          fillRule="evenodd"
          filter={borderShadow ? "url(#pf-shadow)" : undefined}
          rx={cornerRadius}
        />

        {/* In SVG, rx on <path> doesn't work. So we overlay rounded frame using a mask. */}
        <defs>
          <mask id="rounded-mask">
            {/* Outer rounded rect visible (white) */}
            <rect x="0" y="0" width={vbW} height={vbH} rx={cornerRadius} fill="white" />
            {/* Inner photo window hidden (black) — makes it a HOLE */}
            <rect x={innerX} y={innerY} width={innerW} height={innerH} rx={Math.max(cornerRadius - 10, 8)} fill="black" />
          </mask>
        </defs>
        {/* Draw a solid rect and apply the mask to achieve a rounded, punched-out frame */}
        <rect
          x="0"
          y="0"
          width={vbW}
          height={vbH}
          fill={frameColor}
          mask="url(#rounded-mask)"
          filter={borderShadow ? "url(#pf-shadow)" : undefined}
        />

        {/* Optional handwritten-style label area */}
        {label ? (
          <foreignObject x="0" y={labelY - 30} width={vbW} height={60}>
            <div className="w-full h-full flex items-center justify-center">
              <span className={labelProps}>{label}</span>
            </div>
          </foreignObject>
        ) : null}
      </svg>
    </div>
  );
}
