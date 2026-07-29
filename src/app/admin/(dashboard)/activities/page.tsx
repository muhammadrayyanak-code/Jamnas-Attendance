'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, Save, X, CalendarDays, Target } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

type Day = { id: string; name: string; date: string };
type Activity = { id: string; name: string; pointValue: number; dayId: string };

export default function AdminActivities() {
  const [days, setDays] = useState<Day[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    pointValue: '',
    dayId: ''
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/activities', { 
        credentials: 'include',
        cache: 'no-store' 
      });
      if (res.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDays(data.days);
      setActivities(data.activities);
    } catch (error: any) {
      toast.error('Gagal memuat data: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!formData.name || !formData.pointValue || !formData.dayId) {
      toast.error('Harap lengkapi semua bidang');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const isEditing = editingId !== null;
      const url = '/api/admin/activities';
      const method = isEditing ? 'PUT' : 'POST';
      const body = isEditing 
        ? JSON.stringify({ id: editingId, ...formData })
        : JSON.stringify(formData);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      toast.success(`Aktivitas berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}`);
      setEditingId(null);
      setIsAdding(false);
      setFormData({ name: '', pointValue: '', dayId: '' });
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus aktivitas ini? Data absen terkait juga akan hilang (dari database lokal).')) return;
    
    try {
      const res = await fetch(`/api/admin/activities?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success('Aktivitas berhasil dihapus');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const startEdit = (act: Activity) => {
    setEditingId(act.id);
    setIsAdding(true);
    setFormData({
      name: act.name,
      pointValue: act.pointValue.toString(),
      dayId: act.dayId
    });
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', pointValue: '', dayId: '' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-center" />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground drop-shadow-sm">Kelola Aktivitas (Kegiatan Fix)</h1>
          <p className="text-muted-foreground mt-1">Atur daftar kegiatan wajib yang harus diikuti peserta.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-xl flex items-center gap-2 font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" /> Tambah Kegiatan
          </button>
        )}
      </div>

      {isAdding && (
        <div className="glass p-6 rounded-2xl shadow-xl border border-white/20 mb-8 animate-in slide-in-from-top-4 fade-in duration-300">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            {editingId ? <Edit2 className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
            {editingId ? 'Edit Kegiatan' : 'Kegiatan Baru'}
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Kegiatan</label>
              <input 
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded-xl border border-input bg-background/50 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Misal: Penjelajahan Hutan"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Poin Kehadiran</label>
              <input 
                type="number"
                value={formData.pointValue}
                onChange={e => setFormData({ ...formData, pointValue: e.target.value })}
                className="w-full p-3 rounded-xl border border-input bg-background/50 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Misal: 10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hari Pelaksanaan</label>
              <select 
                value={formData.dayId}
                onChange={e => setFormData({ ...formData, dayId: e.target.value })}
                className="w-full p-3 rounded-xl border border-input bg-background/50 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="" disabled>-- Pilih Hari --</option>
                {days.map(day => (
                  <option key={day.id} value={day.id}>{day.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={cancelEdit} className="px-4 py-2 rounded-xl bg-muted text-muted-foreground font-bold hover:bg-muted/80 flex items-center gap-2">
              <X className="w-4 h-4" /> Batal
            </button>
            <button onClick={handleSave} disabled={isSubmitting} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 flex items-center gap-2 shadow-md">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Simpan
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {days.map(day => {
          const dayActivities = activities.filter(a => a.dayId === day.id);
          return (
            <div key={day.id} className="glass rounded-2xl p-5 border border-white/10 shadow-lg">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{day.name}</h3>
                </div>
              </div>
              
              {dayActivities.length === 0 ? (
                <p className="text-muted-foreground text-sm italic text-center py-4">Belum ada kegiatan untuk hari ini.</p>
              ) : (
                <ul className="space-y-3">
                  {dayActivities.map(act => (
                    <li key={act.id} className="flex justify-between items-center p-3 rounded-xl bg-background/40 hover:bg-background/60 transition-colors group">
                      <div className="flex items-center gap-3">
                        <Target className="w-4 h-4 text-primary" />
                        <div>
                          <p className="font-semibold text-sm">{act.name}</p>
                          <p className="text-xs text-muted-foreground">Poin: {act.pointValue}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(act)} className="p-1.5 text-accent hover:bg-accent/10 rounded-md transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(act.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
