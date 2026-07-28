'use client';

import AttendanceWizard from '@/components/AttendanceWizard';
import { Tent } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="bg-mesh bg-background text-foreground min-h-[100dvh] relative flex flex-col items-center justify-center">
      {/* Decorative overlays */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center w-full px-4 py-8 md:py-16">
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10 md:mb-12 max-w-2xl mx-auto"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="animate-float inline-flex items-center justify-center p-5 bg-background/60 backdrop-blur-xl rounded-full mb-6 shadow-2xl border border-white/20 ring-4 ring-primary/10"
          >
            <Tent className="w-12 h-12 md:w-16 md:h-16 text-primary drop-shadow-md" />
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
            <span className="bg-gradient-to-br from-primary via-primary/80 to-accent bg-clip-text text-transparent drop-shadow-sm filter drop-shadow-lg">
              Pembekalan Jamboree
            </span>
          </h1>
          
          <h2 className="text-xl md:text-3xl font-bold text-foreground/90 mb-4 tracking-wider uppercase">
            Kontingen Daerah DIY
          </h2>
          
          <p className="text-muted-foreground text-sm md:text-lg font-medium px-4 max-w-xl mx-auto">
            Selamat datang! Sistem presensi modern untuk mencatat perjalanan dan partisipasi Anda.
          </p>
        </motion.div>
        
        <div className="w-full max-w-2xl grid md:grid-cols-2 gap-6 relative">
          <motion.a 
            href="/registrasi"
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.97 }}
            className="group block p-8 rounded-3xl bg-card/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgba(139,94,52,0.3)] border border-white/20 transition-all text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 text-primary group-hover:shadow-[0_0_20px_rgba(139,94,52,0.5)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Registrasi Peserta</h3>
            <p className="text-muted-foreground text-sm font-medium">Pendaftaran awal dengan mengisi data diri lengkap.</p>
          </motion.a>

          <motion.a 
            href="/presensi"
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.97 }}
            className="group block p-8 rounded-3xl bg-card/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_40px_rgba(94,140,97,0.3)] border border-white/20 transition-all text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300 text-accent group-hover:shadow-[0_0_20px_rgba(94,140,97,0.5)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"/><path d="M9 7V2"/><path d="M15 7V2"/><path d="M4 11h16"/><rect width="18" height="18" x="3" y="7" rx="2"/><path d="m9 16 2 2 4-4"/></svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Presensi Kegiatan</h3>
            <p className="text-muted-foreground text-sm font-medium">Check-in harian aktivitas untuk mencatat poin.</p>
          </motion.a>
        </div>
      </div>
    </main>
  );
}
