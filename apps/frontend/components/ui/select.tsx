import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export function Select({ label, error, className, id, children, ...props }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-sm text-paper-muted">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          "w-full rounded-sm bg-surface-raised px-3 py-2.5 text-sm text-paper outline-none focus:ring-2 focus:ring-bronze/40",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-ember">{error}</p>}
    </div>
  );
}
