'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  
  useEffect(() => {
    localStorage.removeItem('admin_token');
  }, []);
  
  const onSubmit = async (data: any) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Username atau password salah');
      const responseData = await res.json();
      if (responseData.token) {
        localStorage.setItem('admin_token', responseData.token);
      }
      
      toast.success('Login berhasil!');
      router.push('/admin');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-mesh relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      <Toaster position="top-center" />
      
      <div className="w-full max-w-md glass p-10 rounded-[2rem] shadow-2xl relative z-10 overflow-hidden group">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-colors" />
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-center mb-8 text-foreground drop-shadow-sm">Admin Access</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="relative">
            <input 
              {...register('username')}
              placeholder=" "
              className="block px-4 pb-2.5 pt-6 w-full text-base text-foreground bg-background/50 rounded-xl border border-input appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer transition-all"
            />
            <label className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none">
              Username
            </label>
          </div>
          
          <div className="relative">
            <input 
              type="password"
              {...register('password')}
              placeholder=" "
              className="block px-4 pb-2.5 pt-6 w-full text-base text-foreground bg-background/50 rounded-xl border border-input appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary peer transition-all"
            />
            <label className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] start-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-primary pointer-events-none">
              Password
            </label>
          </div>
          
          <button type="submit" disabled={isSubmitting} className="w-full p-4 mt-6 rounded-xl bg-primary text-primary-foreground font-bold disabled:opacity-50 flex justify-center items-center hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95">
            {isSubmitting ? <Loader2 className="animate-spin w-6 h-6" /> : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
