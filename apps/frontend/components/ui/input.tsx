import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm text-paper-muted">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-sm bg-surface-raised px-3 py-2.5 text-sm text-paper outline-none transition-shadow placeholder:text-paper-muted/50 focus:ring-2 focus:ring-bronze/40",
          error && "ring-2 ring-ember/40",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-ember">{error}</p>}
    </div>
  );
}
