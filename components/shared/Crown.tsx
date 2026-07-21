// Kingsway brand mark — a minimal, geometric crown. Dignified, not gaudy. Uses currentColor so it
// can be brass (accent) or ink depending on context. Sized via width/height props.
export function Crown({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={(size * 15) / 20}
      viewBox="0 0 20 15"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M1.5 13.2 3 4.2l4 4 3-6 3 6 4-4 1.5 9z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <rect x="1.5" y="12.4" width="17" height="2.1" rx="0.6" fill="currentColor" />
    </svg>
  );
}
