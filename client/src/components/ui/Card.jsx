export default function Card({ children, className = "", noPadding = false }) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.03)] overflow-hidden ${className}`}
    >
      <div className={noPadding ? "" : "p-6"}>{children}</div>
    </div>
  );
}
