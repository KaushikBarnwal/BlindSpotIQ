// Clean light-mode shell for the BlindspotIQ analysis platform at /app
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50/80 text-zinc-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {children}
    </div>
  );
}
