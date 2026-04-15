export default function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6';
  return (
    <div
      className={`${s} animate-spin rounded-full border-2 border-violet-200 border-t-violet-600`}
      role="status"
      aria-label="Loading"
    />
  );
}
