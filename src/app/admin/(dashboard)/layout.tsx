import Link from 'next/link';
import { Home, List, LogOut } from 'lucide-react';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-mesh">
      <aside className="w-64 glass border-r border-white/10 flex flex-col hidden md:flex m-4 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/10 bg-primary/10">
          <h2 className="text-xl font-extrabold text-primary drop-shadow-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Admin Panel
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/20 text-foreground font-medium transition-all hover:pl-5 group">
            <Home className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" /> Dashboard
          </Link>
          <Link href="/admin/peserta" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/20 text-foreground font-medium transition-all hover:pl-5 group">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary group-hover:scale-110 transition-transform"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Data Peserta
          </Link>
          <Link href="/admin/activities" className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/20 text-foreground font-medium transition-all hover:pl-5 group">
            <List className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" /> Aktivitas
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10 bg-black/5">
          <Link href="/api/auth/logout" className="flex items-center gap-3 p-3 rounded-xl hover:bg-destructive text-destructive hover:text-destructive-foreground font-bold transition-all">
            <LogOut className="w-5 h-5" /> Logout
          </Link>
        </div>
      </aside>
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        <div className="glass rounded-3xl min-h-[90vh] shadow-2xl border border-white/10 overflow-hidden relative">
           {children}
        </div>
      </main>
    </div>
  );
}
