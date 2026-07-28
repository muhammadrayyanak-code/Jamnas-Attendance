'use client';

import AttendanceWizard from '@/components/AttendanceWizard';
import { Tent } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PresensiPage() {
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
          className="text-center mb-10 max-w-2xl mx-auto"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="animate-float inline-flex items-center justify-center p-4 bg-background/60 backdrop-blur-md rounded-2xl mb-6 shadow-2xl border border-white/20 ring-4 ring-primary/10"
          >
            <Tent className="w-12 h-12 md:w-16 md:h-16 text-primary drop-shadow-md" />
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            <span className="bg-gradient-to-br from-primary via-primary/80 to-accent bg-clip-text text-transparent drop-shadow-sm filter drop-shadow-lg">
              Presensi Kegiatan
            </span>
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg font-medium px-4">
            Catat kehadiran Anda untuk mendapatkan poin!
          </p>
        </motion.div>
        
        <div className="w-full max-w-md">
          <AttendanceWizard />
        </div>
      </div>
    </main>
  );
}
