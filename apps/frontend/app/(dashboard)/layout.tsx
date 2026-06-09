export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="mesh-bg min-h-screen">{children}</div>;
}
