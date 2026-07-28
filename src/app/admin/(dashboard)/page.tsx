'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, CheckCircle, Search, Download, Check, X as XIcon, MapPin } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchDashboard = async (searchQuery = '') => {
    try {
      const res = await fetch(`/api/admin/dashboard?search=${searchQuery}`);
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const result = await res.json();
      setData(result);
      setLoading(false);
    } catch (e) {
      toast.error('Gagal memuat dashboard');
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchDashboard(search);
  };

  const exportCSV = () => {
    if (!data?.participants || !data?.activities) return;
    
    // Header
    const actHeaders = data.activities.map((act: any) => `"${act.name}"`).join(",");
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `NTA,Nama Lengkap,Kwarcab,Regu,Total Poin,${actHeaders}\n`;
    
    // Rows
    csvContent += data.participants.map((p: any) => {
      const actCells = data.activities.map((act: any) => {
        const attended = p.attendances?.some((a: any) => a.activityId === act.id);
        return attended ? "Hadir" : "Tidak";
      }).join(",");
      return `"${p.nta}","${p.name}","${p.kwarcab}","${p.regu}",${p.totalPoints},${actCells}`;
    }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "matrix_presensi_kegiatan_scout.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-primary font-bold">Memuat Matrix Kehadiran...</p>
        </div>
      </div>
    );
  }

  const activities = data?.activities || [];
  const participants = data?.participants || [];

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground drop-shadow-sm">Matrix Kehadiran</h1>
          <p className="text-muted-foreground font-medium mt-1">Pantau rekap kehadiran seluruh peserta di semua kegiatan wajib.</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-bold">
          <Download className="w-5 h-5" /> Export Matrix CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl shadow-lg border border-white/20 flex items-center gap-5">
          <div className="p-4 bg-primary/20 rounded-2xl text-primary shadow-inner">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Total Peserta</p>
            <p className="text-4xl font-extrabold text-foreground">{data?.stats?.totalParticipants || 0}</p>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl shadow-lg border border-white/20 flex items-center gap-5">
          <div className="p-4 bg-accent/20 rounded-2xl text-accent shadow-inner">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Total Kegiatan Fix</p>
            <p className="text-4xl font-extrabold text-foreground">{activities.length}</p>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl shadow-lg border border-white/20 flex items-center gap-5">
           <form onSubmit={handleSearch} className="w-full relative">
            <label className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-2 block">Pencarian Peserta</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Cari NTA, Nama, Regu..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-input/50 focus:ring-2 focus:ring-primary focus:outline-none bg-background/50 text-foreground shadow-inner" 
              />
              <Search className="w-5 h-5 absolute left-4 top-3.5 text-muted-foreground" />
            </div>
            <button type="submit" className="hidden">Search</button>
          </form>
        </div>
      </div>

      <div className="glass rounded-2xl shadow-2xl border border-white/10 overflow-hidden mt-8">
        <div className="overflow-x-auto max-h-[60vh] relative">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead className="bg-background/80 backdrop-blur-md sticky top-0 z-20 text-muted-foreground text-xs uppercase font-extrabold tracking-wider border-b border-border shadow-sm">
              <tr>
                <th className="px-5 py-5 sticky left-0 z-30 bg-background/90 backdrop-blur-xl border-r border-border min-w-[250px]">
                  Informasi Peserta
                </th>
                <th className="px-5 py-5 text-center bg-background/80 border-r border-border min-w-[100px]">Total Poin</th>
                {activities.map((act: any) => (
                  <th key={act.id} className="px-4 py-5 text-center border-r border-border/50 min-w-[140px] max-w-[180px] whitespace-normal">
                    <div className="font-bold text-foreground leading-tight">{act.name}</div>
                    <div className="text-[10px] text-accent mt-1 bg-accent/10 px-2 py-0.5 rounded-full inline-block">+{act.pointValue} Poin</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {participants.map((p: any, index: number) => (
                <tr key={p.nta} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-5 py-3 sticky left-0 z-10 bg-background/60 backdrop-blur-md border-r border-border group-hover:bg-background/80 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground text-sm">{p.name}</span>
                      <span className="text-xs text-muted-foreground font-mono mt-0.5">{p.nta}</span>
                      <div className="flex items-center gap-1 text-xs text-primary/80 font-medium mt-1">
                        <MapPin className="w-3 h-3" /> {p.kwarcab} ({p.regu})
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center border-r border-border bg-background/20">
                    <span className="bg-accent/10 text-accent px-3 py-1.5 rounded-full font-extrabold text-sm shadow-sm inline-block min-w-[3rem]">
                      {p.totalPoints}
                    </span>
                  </td>
                  {activities.map((act: any) => {
                    const attended = p.attendances?.some((a: any) => a.activityId === act.id);
                    return (
                      <td key={act.id} className="px-4 py-3 text-center border-r border-border/50">
                        {attended ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10 text-green-600 shadow-sm">
                            <Check className="w-5 h-5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500/5 text-red-400/50">
                            <XIcon className="w-4 h-4 stroke-[2]" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {participants.length === 0 && (
                <tr>
                  <td colSpan={activities.length + 2} className="px-6 py-12 text-center text-muted-foreground font-medium">
                    Tidak ada data peserta yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
