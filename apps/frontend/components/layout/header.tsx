interface HeaderProps {
  title: string;
  action?: React.ReactNode;
}

export function Header({ title, action }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-surface-raised px-8 py-5">
      <h1 className="font-display text-2xl text-paper">{title}</h1>
      {action}
    </header>
  );
}
