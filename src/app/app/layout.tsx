// Dark-mode shell for the main BlindspotIQ analysis platform at /app
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark-scrollbar min-h-screen bg-zinc-950 text-zinc-100 selection:bg-rose-500 selection:text-white">
      {children}
    </div>
  );
}
