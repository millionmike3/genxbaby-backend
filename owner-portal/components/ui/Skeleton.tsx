export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-gray-800/50 rounded-md ${className}`}
    />
  );
}
