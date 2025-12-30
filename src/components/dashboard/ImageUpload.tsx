"use client";

import { useState } from "react";
import { storage } from "@/lib/firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Camera, Loader2, CheckCircle, X } from "lucide-react";
import Image from "next/image";

export default function ImageUpload({ onUploadComplete }: { onUploadComplete: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const storageRef = ref(storage, `recipes/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => console.error(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onUploadComplete(downloadURL);
          setUploading(false);
        }
      );
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-slate-200">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
              <Loader2 className="animate-spin" />
            </div>
          )}
          {!uploading && (
            <button 
              onClick={() => setPreview(null)}
              className="absolute top-2 right-2 bg-white/90 p-1 rounded-full text-red-500 shadow-lg"
            >
              <X size={20} />
            </button>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Camera className="w-10 h-10 mb-3 text-slate-400" />
            <p className="mb-2 text-sm text-slate-500 font-bold uppercase tracking-widest">Upload Hero Image</p>
            <p className="text-xs text-slate-400 text-center px-4">Professional photography recommended for Conscious Cuisine</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        </label>
      )}
    </div>
  );
}