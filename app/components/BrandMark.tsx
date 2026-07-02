/**
 * Kitchen Heirloom brand mark — a pot with rising steam, drawn as inline SVG
 * so it inherits `currentColor` and scales cleanly at any size (navbar chip,
 * footer, auth lockups). Server-safe: no hooks, no client state.
 */
export default function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 13h16" />
      <path d="M5 13v1.5a5 5 0 0 0 5 5h4a5 5 0 0 0 5-5V13" />
      <path d="M8 9.8c1.2-1.2 1.2-3 0-4.2" />
      <path d="M12.2 9.8c1-1 1-2.4 0-3.4" />
      <path d="M16.2 9.8c.8-.8.8-1.8 0-2.6" />
    </svg>
  );
}
