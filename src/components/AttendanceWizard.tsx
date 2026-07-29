'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, CheckCircle, CalendarDays, IdCard, User, Target, ChevronRight, Check, MapPin, Users } from 'lucide-react';

type Day = { id: string; name: string; date: string };
type Activity = { id: string; name: string; pointValue: number; dayId: string };

const STEPS = [
  { id: 1, title: 'Hari', icon: CalendarDays },
  { id: 2, title: 'Identitas', icon: IdCard },
  { id: 3, title: 'Aktivitas', icon: Target },
];

const KWARCAB_OPTIONS = [
  "Kulon Progo",
  "Bantul",
  "Gunungkidul",
  "Sleman",
  "Kota Yogyakarta"
];

export default function AttendanceWizard() {
  const [step, setStep] = useState(1);
  const [days, setDays] = useState<Day[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, trigger } = useForm({
    shouldUnregister: false
  });
  
  useEffect(() => {
    fetch('/api/activities')
      .then(res => res.json())
      .then(data => {
        setDays(data.days || []);
        setActivities(data.activities || []);
        setIsLoading(false);
      })
      .catch(() => {
        toast.error('Gagal memuat data');
        setIsLoading(false);
      });
  }, []);

  const onSubmit = async (data: any) => {
    if (!data.activityId) {
      toast.error('Pilih salah satu aktivitas!');
      return;
    }

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Terjadi kesalahan');
      
      setSuccessData(result);
      setStep(4);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleNextStep2 = async () => {
    const isValid = await trigger(['kwarcab', 'regu', 'name']);
    if (isValid) setStep(3);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card/80 backdrop-blur-xl rounded-[var(--radius)] shadow-2xl border border-border/50">
        <Loader2 className="animate-spin text-primary w-12 h-12 mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Menyiapkan form...</p>
      </div>
    );
  }

  const filteredActivities = activities.filter(a => a.dayId === selectedDay);

  return (
    <div className="w-full relative">
      <Toaster position="top-center" />
      
      <div className="w-full glass rounded-[1.5rem] p-6 sm:p-10">
        
        {/* Custom Premium Stepper */}
        {step < 4 && (
          <div className="flex items-center justify-between w-full mb-12 mt-4 px-2">
            {STEPS.map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              
              return (
                <React.Fragment key={s.id}>
                  {/* Step Item */}
                  <div className="relative flex flex-col items-center shrink-0">
                    <motion.div 
                      initial={false}
                      animate={{
                        backgroundColor: isActive || isCompleted ? 'var(--primary)' : 'var(--card)',
                        borderColor: isActive || isCompleted ? 'var(--primary)' : 'var(--muted-foreground)',
                        color: isActive || isCompleted ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                        scale: isActive ? 1.1 : 1
                      }}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center shadow-md transition-colors z-10 ${isActive ? 'ring-4 ring-primary/20' : ''}`}
                    >
                      {isCompleted ? <Check className="w-5 h-5 sm:w-6 sm:h-6" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </motion.div>
                    <span className={`absolute top-12 sm:top-14 whitespace-nowrap text-[10px] sm:text-xs font-semibold transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {s.title}
                    </span>
                  </div>

                  {/* Connector Line */}
                  {idx < STEPS.length - 1 && (
                    <div className="flex-1 h-1 bg-muted/50 relative mx-2 sm:mx-4 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-in-out rounded-full" 
                        style={{ width: step > s.id ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="min-h-[300px]">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: HARI */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="text-2xl font-bold mb-6 text-foreground text-center">Pilih Jadwal Pembekalan</h2>
                <div className="space-y-4">
                  {days.map((day, idx) => (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={day.id}
                      type="button"
                      onClick={() => { setSelectedDay(day.id); setStep(2); }}
                      className="w-full p-5 rounded-xl bg-secondary/30 border border-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-between group shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-background/50 rounded-lg group-hover:bg-primary-foreground/20 transition-colors">
                          <CalendarDays className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-lg">{day.name}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </motion.button>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <a href="/" className="text-muted-foreground hover:text-primary transition-colors text-sm font-semibold underline underline-offset-4">Kembali ke Beranda</a>
                </div>
              </motion.div>
            )}

            {/* STEP 2: IDENTITAS */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="text-2xl font-bold mb-6 text-foreground text-center">Data Perutusan</h2>
                
                <div className="space-y-5 mb-8">

                  <div className="flex flex-col">
                    <div className="relative">
                      <select 
                        {...register('kwarcab', { required: 'Kwartir Cabang wajib dipilih' })}
                        id="kwarcab2"
                        defaultValue=""
                        className="block px-12 pb-2.5 pt-6 w-full text-base text-foreground bg-background/50 rounded-xl border border-input appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer transition-all cursor-pointer"
                      >
                        <option value="" disabled hidden></option>
                        {KWARCAB_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <label htmlFor="kwarcab2" className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-12 peer-focus:text-primary pointer-events-none">
                        Asal Kwartir Cabang
                      </label>
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:text-primary transition-colors z-10 w-5 h-5 pointer-events-none" />
                    </div>
                    {errors.kwarcab && <p className="text-destructive text-xs mt-1.5 ml-2 font-medium">{errors.kwarcab.message as string}</p>}
                  </div>

                  <div className="flex flex-col">
                    <div className="relative">
                      <input 
                        {...register('regu', { required: 'Nama Regu wajib diisi' })}
                        id="regu2"
                        className="block px-12 pb-2.5 pt-6 w-full text-base text-foreground bg-background/50 rounded-xl border border-input appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer transition-all"
                        placeholder=" "
                      />
                      <label htmlFor="regu2" className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none">
                        Nama Regu
                      </label>
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:text-primary transition-colors z-10 w-5 h-5 pointer-events-none" />
                    </div>
                    {errors.regu && <p className="text-destructive text-xs mt-1.5 ml-2 font-medium">{errors.regu.message as string}</p>}
                  </div>

                  <div className="flex flex-col">
                    <div className="relative">
                      <input 
                        {...register('name', { required: 'Nama Lengkap wajib diisi' })}
                        id="name2"
                        className="block px-12 pb-2.5 pt-6 w-full text-base text-foreground bg-background/50 rounded-xl border border-input appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer transition-all"
                        placeholder=" "
                      />
                      <label htmlFor="name2" className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none">
                        Nama Lengkap
                      </label>
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:text-primary transition-colors z-10 w-5 h-5 pointer-events-none" />
                    </div>
                    {errors.name && <p className="text-destructive text-xs mt-1.5 ml-2 font-medium">{errors.name.message as string}</p>}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 p-4 rounded-xl bg-muted text-muted-foreground font-bold hover:bg-muted/80 transition-all active:scale-95">Kembali</button>
                  <button type="button" onClick={handleNextStep2} className="flex-1 p-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">Selanjutnya</button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: AKTIVITAS */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="text-2xl font-bold mb-6 text-foreground text-center">Pilih Kegiatan Wajib</h2>
                
                <div className="space-y-4 mb-8">
                  {filteredActivities.length === 0 ? (
                    <div className="text-center p-8 bg-muted/50 rounded-xl border border-dashed border-muted-foreground/30">
                      <Target className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                      <p className="text-muted-foreground font-medium">Belum ada aktivitas yang didaftarkan panitia untuk hari ini.</p>
                    </div>
                  ) : filteredActivities.map((act, idx) => (
                    <motion.label 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                      key={act.id} 
                      className="relative flex items-center p-5 border-2 border-transparent rounded-xl cursor-pointer bg-secondary/20 hover:bg-secondary/40 transition-all shadow-sm has-[:checked]:bg-primary/10 has-[:checked]:border-primary"
                    >
                      <input 
                        type="radio" 
                        value={act.id} 
                        {...register('activityId')}
                        className="w-5 h-5 text-primary accent-primary mr-4" 
                      />
                      <div className="flex-1">
                        <span className="font-bold text-foreground block text-lg">{act.name}</span>
                        <span className="text-sm text-primary font-medium flex items-center gap-1 mt-1">
                          <CheckCircle className="w-4 h-4" />
                          Mendapatkan {act.pointValue} Poin
                        </span>
                      </div>
                    </motion.label>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 p-4 rounded-xl bg-muted text-muted-foreground font-bold hover:bg-muted/80 transition-all active:scale-95">Kembali</button>
                  <button type="submit" disabled={isSubmitting || filteredActivities.length === 0} className="flex-1 p-4 rounded-xl bg-accent text-accent-foreground font-bold hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center">
                    {isSubmitting ? <Loader2 className="animate-spin w-6 h-6" /> : 'Selesai & Hadir'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }} 
                  animate={{ scale: 1, rotate: 0 }} 
                  transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                  className="w-28 h-28 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                  <CheckCircle className="w-16 h-16 text-accent drop-shadow-md" />
                </motion.div>
                
                <h2 className="text-3xl font-extrabold mb-3 text-foreground">Presensi Berhasil!</h2>
                <div className="bg-secondary/30 p-4 rounded-xl mb-8 border border-secondary inline-block mx-auto">
                  <p className="text-foreground text-lg mb-1">
                    Halo, <strong>{successData?.participant?.name}</strong>
                  </p>
                  <p className="text-muted-foreground font-medium">
                    Anda berhasil check-in dan meraih <span className="font-bold text-accent text-xl">+{successData?.pointsAwarded} Poin</span>
                  </p>
                </div>

                <button 
                  type="button" 
                  onClick={() => {
                    setStep(1);
                    setSelectedDay(null);
                  }} 
                  className="w-full p-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:shadow-lg transition-all active:scale-95"
                >
                  Kembali ke Awal
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
