export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-sm border border-surface-raised bg-surface p-8 shadow-[0_24px_64px_rgba(0,0,0,0.4)]">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl text-paper">Contexto</h1>
          <p className="mt-1 text-sm text-paper-muted">Document intelligence</p>
        </div>
        {children}
      </div>
    </div>
  );
}
