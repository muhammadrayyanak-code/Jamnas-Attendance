'use client';

import React, { useEffect, useState } from 'react';
import { Search, Download, MapPin, Phone, School, Cake, AlertCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function PesertaPage() {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const fetchPeserta = async (searchQuery = '') => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/peserta?search=${searchQuery}`, { 
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
      });
      if (res.status === 401) {
        const errorData = await res.json().catch(() => ({}));
        toast.error(`Sesi berakhir. Server error: ${errorData.error || 'Unknown'}`);
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 5000);
        return;
      }
      if (!res.ok) throw new Error('Gagal memuat data peserta');
      const data = await res.json();
      setParticipants(data.participants);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeserta();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchPeserta(search);
  };

  const downloadExcel = async () => {
    setIsExporting(true);
    
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/export-peserta`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Gagal mengunduh file');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Data_Registrasi_Peserta.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Gagal mengekspor data');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-primary font-bold">Memuat Data Peserta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground drop-shadow-sm">Data Peserta</h1>
          <p className="text-muted-foreground font-medium mt-1">Daftar seluruh peserta dan informasi registrasinya.</p>
        </div>
        <button
          onClick={downloadExcel}
          disabled={isExporting}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg ${
            isExporting 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover:shadow-primary/20'
          }`}
        >
          {isExporting ? (
            <div className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Download className="w-5 h-5" />
          )}
          {isExporting ? 'Mengekspor...' : 'Unduh Excel Registrasi'}
        </button>
      </div>

      <div className="glass p-6 rounded-2xl shadow-lg border border-white/10 flex items-center gap-5">
        <form onSubmit={handleSearch} className="w-full relative">
          <label className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-2 block">Pencarian Peserta</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Cari Nama, Regu, atau Kwarcab..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-input/50 focus:ring-2 focus:ring-primary focus:outline-none bg-background/50 text-foreground shadow-inner" 
            />
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-muted-foreground" />
          </div>
          <button type="submit" className="hidden">Search</button>
        </form>
      </div>

      <div className="glass rounded-2xl shadow-2xl border border-white/10 overflow-hidden mt-8">
        <div className="overflow-x-auto max-h-[60vh] relative">
          <table className="w-full text-left whitespace-nowrap border-collapse">
            <thead className="bg-background/80 backdrop-blur-md sticky top-0 z-20 text-muted-foreground text-xs uppercase font-extrabold tracking-wider border-b border-border shadow-sm">
              <tr>
                <th className="px-5 py-5 bg-background/90 backdrop-blur-xl border-r border-border min-w-[250px] sticky left-0 z-30">
                  Peserta & Kwarcab
                </th>
                <th className="px-5 py-5 border-r border-border">Tanggal Lahir</th>
                <th className="px-5 py-5 border-r border-border">Asal Sekolah</th>
                <th className="px-5 py-5 border-r border-border">No WA</th>
                <th className="px-5 py-5">Alergi Makanan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {participants.map((p: any) => (
                <tr key={p.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-5 py-3 bg-background/60 backdrop-blur-md border-r border-border group-hover:bg-background/80 transition-colors sticky left-0 z-10">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground text-sm">{p.name}</span>
                      <div className="flex items-center gap-1 text-xs text-primary/80 font-medium mt-1">
                        <MapPin className="w-3 h-3" /> {p.kwarcab} ({p.regu})
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 border-r border-border/50">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Cake className="w-4 h-4 text-muted-foreground" />
                      {p.ttl || '-'}
                    </div>
                  </td>
                  <td className="px-5 py-3 border-r border-border/50">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <School className="w-4 h-4 text-muted-foreground" />
                      {p.asalSekolah || '-'}
                    </div>
                  </td>
                  <td className="px-5 py-3 border-r border-border/50">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {p.noWa ? (
                        <a href={`https://wa.me/${p.noWa.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary underline decoration-primary/30 underline-offset-2">
                          {p.noWa}
                        </a>
                      ) : '-'}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      {p.alergiMakanan && p.alergiMakanan.toLowerCase() !== 'tidak ada' && p.alergiMakanan.toLowerCase() !== '-' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 font-medium border border-red-500/20 text-xs">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {p.alergiMakanan}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {participants.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-medium">
                    Tidak ada data peserta.
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
