'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2, CheckCircle, MapPin, Users, User, Phone, Map, BookOpen, AlertCircle, Check, CalendarDays, IdCard } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Perutusan', icon: MapPin },
  { id: 2, title: 'Identitas', icon: User },
];

const KWARCAB_OPTIONS = [
  "Kulon Progo",
  "Bantul",
  "Gunungkidul",
  "Sleman",
  "Kota Yogyakarta"
];

const AGAMA_OPTIONS = [
  "Islam",
  "Katolik",
  "Protestan",
  "Hindu",
  "Budha",
  "Opsi lain"
];

export default function RegistrationWizard() {
  const [step, setStep] = useState(1);
  const [successData, setSuccessData] = useState<any>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, trigger } = useForm({
    shouldUnregister: false
  });

  const onSubmit = async (data: any) => {
    const formattedData = {
      ...data,
      ttl: data.tempatLahir && data.tanggalLahir ? `${data.tempatLahir}, ${data.tanggalLahir}` : undefined
    };

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData)
      });
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Terjadi kesalahan saat registrasi');
      
      setSuccessData(result);
      setStep(3);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleNextStep = async () => {
    const isValid = await trigger(['kwarcab', 'regu']);
    if (isValid) setStep(2);
  };

  return (
    <div className="w-full relative">
      <Toaster position="top-center" />
      
      <div className="w-full glass rounded-[1.5rem] p-6 sm:p-10">
        
        {step < 3 && (
          <div className="flex items-center justify-between w-full mb-12 mt-4 px-2 sm:px-4">
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
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-md transition-colors z-10 ${isActive ? 'ring-4 ring-primary/20' : ''}`}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                    </motion.div>
                    <span className={`absolute top-14 whitespace-nowrap text-sm font-semibold transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                      {s.title}
                    </span>
                  </div>

                  {/* Connector Line */}
                  {idx < STEPS.length - 1 && (
                    <div className="flex-1 h-1 bg-muted/50 relative mx-4 rounded-full overflow-hidden">
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
            
            {/* STEP 1: PERUTUSAN */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="text-2xl font-bold mb-6 text-foreground text-center">Data Perutusan</h2>
                
                <div className="space-y-5 mb-8">
                  <div className="flex flex-col">
                    <div className="relative">
                      <select 
                        {...register('kwarcab', { required: 'Kwartir Cabang wajib dipilih' })}
                        id="kwarcab"
                        defaultValue=""
                        className="block px-12 pb-2.5 pt-6 w-full text-base text-foreground bg-background/50 rounded-xl border border-input appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer transition-all cursor-pointer"
                      >
                        <option value="" disabled hidden></option>
                        {KWARCAB_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <label htmlFor="kwarcab" className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-12 peer-focus:text-primary pointer-events-none">
                        Asal Kwartir Cabang
                      </label>
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:text-primary transition-colors z-10 w-5 h-5 pointer-events-none" />
                    </div>
                    {errors.kwarcab && <p className="text-destructive text-xs mt-1.5 ml-2 font-medium">{errors.kwarcab.message as string}</p>}
                  </div>

                  <div className="flex flex-col mt-2">
                    <div className="relative">
                      <input 
                        {...register('regu', { required: 'Nama Regu wajib diisi' })}
                        id="regu"
                        className="block px-12 pb-2.5 pt-6 w-full text-base text-foreground bg-background/50 rounded-xl border border-input appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer transition-all"
                        placeholder=" "
                      />
                      <label htmlFor="regu" className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none">
                        Nama Regu (Contoh: Rajawali)
                      </label>
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:text-primary transition-colors z-10 w-5 h-5 pointer-events-none" />
                    </div>
                    {errors.regu && <p className="text-destructive text-xs mt-1.5 ml-2 font-medium">{errors.regu.message as string}</p>}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={handleNextStep} className="w-full p-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">Selanjutnya</button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: IDENTITAS PESERTA */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <h2 className="text-2xl font-bold mb-6 text-foreground text-center">Identitas Peserta</h2>
                
                <div className="space-y-4 mb-8">


                  <div className="flex flex-col">
                    <div className="relative">
                      <input 
                        {...register('name', { required: 'Nama Lengkap wajib diisi' })}
                        id="name"
                        className="block px-12 pb-2.5 pt-6 w-full text-base text-foreground bg-background/50 rounded-xl border border-input appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer transition-all"
                        placeholder=" "
                      />
                      <label htmlFor="name" className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none">
                        Nama Lengkap
                      </label>
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:text-primary transition-colors w-5 h-5 pointer-events-none" />
                    </div>
                    {errors.name && <p className="text-destructive text-xs mt-1.5 ml-2 font-medium">{errors.name.message as string}</p>}
                  </div>

                  <div className="flex flex-col">
                    <div className="relative">
                      <select 
                        {...register('agama', { required: 'Agama wajib dipilih' })}
                        id="agama"
                        className="block px-12 pb-2.5 pt-6 w-full text-base text-foreground bg-background/50 rounded-xl border border-input appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer transition-all cursor-pointer"
                      >
                        <option value="" disabled selected hidden></option>
                        {AGAMA_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <label htmlFor="agama" className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-12 peer-focus:text-primary pointer-events-none">
                        Agama
                      </label>
                    </div>
                    {errors.agama && <p className="text-destructive text-xs mt-1.5 ml-2 font-medium">{errors.agama.message as string}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <div className="relative">
                        <input 
                          {...register('tempatLahir', { required: 'Tempat Lahir wajib diisi' })}
                          id="tempatLahir"
                          className="block px-12 pb-2.5 pt-6 w-full text-base text-foreground bg-background/50 rounded-xl border border-input appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer transition-all"
                          placeholder=" "
                        />
                        <label htmlFor="tempatLahir" className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none">
                          Tempat Lahir
                        </label>
                        <Map className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:text-primary transition-colors w-5 h-5 pointer-events-none" />
                      </div>
                      {errors.tempatLahir && <p className="text-destructive text-xs mt-1.5 ml-2 font-medium">{errors.tempatLahir.message as string}</p>}
                    </div>

                    <div className="flex flex-col">
                      <div className="relative">
                        <input 
                          type="date"
                          {...register('tanggalLahir', { required: 'Tanggal Lahir wajib diisi' })}
                          id="tanggalLahir"
                          className="block px-12 pb-2.5 pt-6 w-full text-base text-foreground bg-background/50 rounded-xl border border-input appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer transition-all"
                        />
                        <label htmlFor="tanggalLahir" className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-12 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none">
                          Tanggal Lahir
                        </label>
                        <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:text-primary transition-colors w-5 h-5 pointer-events-none" />
                      </div>
                      {errors.tanggalLahir && <p className="text-destructive text-xs mt-1.5 ml-2 font-medium">{errors.tanggalLahir.message as string}</p>}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="relative">
                      <input 
                        {...register('asalSekolah', { required: 'Asal Sekolah wajib diisi' })}
                        id="asalSekolah"
                        className="block px-12 pb-2.5 pt-6 w-full text-base text-foreground bg-background/50 rounded-xl border border-input appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer transition-all"
                        placeholder=" "
                      />
                      <label htmlFor="asalSekolah" className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none">
                        Asal Pangkalan / Sekolah
                      </label>
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:text-primary transition-colors w-5 h-5 pointer-events-none" />
                    </div>
                    {errors.asalSekolah && <p className="text-destructive text-xs mt-1.5 ml-2 font-medium">{errors.asalSekolah.message as string}</p>}
                  </div>

                  <div className="flex flex-col">
                    <div className="relative">
                      <input 
                        {...register('noWa', { required: 'Nomor WhatsApp wajib diisi' })}
                        id="noWa"
                        className="block px-12 pb-2.5 pt-6 w-full text-base text-foreground bg-background/50 rounded-xl border border-input appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer transition-all"
                        placeholder=" "
                      />
                      <label htmlFor="noWa" className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none">
                        Nomor WhatsApp
                      </label>
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:text-primary transition-colors w-5 h-5 pointer-events-none" />
                    </div>
                    {errors.noWa && <p className="text-destructive text-xs mt-1.5 ml-2 font-medium">{errors.noWa.message as string}</p>}
                  </div>

                  <div className="flex flex-col">
                    <div className="relative">
                      <input 
                        {...register('alergiMakanan')}
                        id="alergi"
                        className="block px-12 pb-2.5 pt-6 w-full text-base text-foreground bg-background/50 rounded-xl border border-input appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer transition-all"
                        placeholder=" "
                      />
                      <label htmlFor="alergi" className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none">
                        Alergi Makanan
                      </label>
                      <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground peer-focus:text-primary transition-colors w-5 h-5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 p-3 rounded-xl bg-muted text-muted-foreground font-bold hover:bg-muted/80 transition-all active:scale-95">Kembali</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 p-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center">
                    {isSubmitting ? <Loader2 className="animate-spin w-6 h-6" /> : 'Registrasi'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: SUCCESS */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }} 
                  animate={{ scale: 1, rotate: 0 }} 
                  transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                  className="w-28 h-28 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                  <CheckCircle className="w-16 h-16 text-accent drop-shadow-md" />
                </motion.div>
                
                <h2 className="text-3xl font-extrabold mb-3 text-foreground">Registrasi Berhasil!</h2>
                <div className="bg-secondary/30 p-4 rounded-xl mb-8 border border-secondary inline-block mx-auto">
                  <p className="text-foreground text-lg mb-1">
                    Terima kasih, <strong>{successData?.participant?.name}</strong>
                  </p>
                  <p className="text-muted-foreground font-medium">
                    Data Anda dari Kwarcab {successData?.participant?.kwarcab} telah tersimpan.
                  </p>
                </div>

                <a 
                  href="/"
                  className="block w-full p-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:shadow-lg transition-all active:scale-95"
                >
                  Kembali ke Menu Utama
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
