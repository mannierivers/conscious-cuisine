"use client";

import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, ChefHat } from "lucide-react";

export default function VideoPlayer({ videoUrl, poster }: { videoUrl: string, poster: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full aspect-video rounded-[3rem] overflow-hidden shadow-2xl bg-slate-900 group">
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        muted={isMuted}
        loop
        playsInline
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
      />

      {/* --- OVERLAY CONTROLS --- */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={togglePlay}
              className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:bg-emerald-400 transition-all active:scale-95 shadow-xl shadow-emerald-500/20"
            >
              {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
            </button>
            
            <div className="hidden md:block">
              <p className="text-white font-serif font-bold text-lg">Watch Chef Cary Neff</p>
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Masterclass Technique</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Cinematic Badge */}
      {!isPlaying && (
        <div className="absolute top-8 right-8 bg-emerald-500/90 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <ChefHat size={14} /> 4K Cinematic
        </div>
      )}
    </div>
  );
}