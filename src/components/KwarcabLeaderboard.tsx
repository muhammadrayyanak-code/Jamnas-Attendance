'use client';

import { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

type LeaderboardEntry = {
  kwarcab: string;
  points: number;
};

export default function KwarcabLeaderboard() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        if (res.ok) {
          const json = await res.json();
          setData(json.leaderboard || []);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 p-6 rounded-3xl bg-card/50 backdrop-blur-md border border-white/10 flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return null;
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />;
      case 1: return <Medal className="w-7 h-7 text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.5)]" />;
      case 2: return <Award className="w-6 h-6 text-amber-700 drop-shadow-[0_0_6px_rgba(180,83,9,0.5)]" />;
      default: return <span className="font-bold text-muted-foreground w-6 text-center">{index + 1}</span>;
    }
  };

  const getRankBg = (index: number) => {
    switch (index) {
      case 0: return 'bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_20px_rgba(250,204,21,0.1)]';
      case 1: return 'bg-gray-400/10 border-gray-400/30';
      case 2: return 'bg-amber-700/10 border-amber-700/30';
      default: return 'bg-card/40 border-white/10';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="w-full max-w-2xl mx-auto mt-12 p-6 md:p-8 rounded-3xl bg-card/60 backdrop-blur-xl border border-white/20 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
      
      <div className="flex items-center justify-center gap-3 mb-8">
        <Flame className="w-8 h-8 text-accent animate-pulse" />
        <h2 className="text-2xl md:text-3xl font-extrabold text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Leaderboard Kwarcab
        </h2>
        <Flame className="w-8 h-8 text-accent animate-pulse" />
      </div>

      <div className="space-y-3">
        {data.map((entry, index) => (
          <motion.div 
            key={entry.kwarcab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className={`flex items-center justify-between p-4 rounded-2xl border ${getRankBg(index)} transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10">
                {getRankIcon(index)}
              </div>
              <h3 className={`font-bold text-lg md:text-xl ${index < 3 ? 'text-foreground' : 'text-foreground/80'}`}>
                {entry.kwarcab}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-primary'}`}>
                {entry.points}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-1">Pts</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
