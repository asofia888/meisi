import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { scanBusinessCard } from '../lib/api';
import { BusinessCard } from '../types';
import { toast } from 'sonner';

interface ScannerProps {
  key?: string;
  onClose: () => void;
  onScanned: (card: Omit<BusinessCard, 'id' | 'createdAt'>) => void;
}

export default function Scanner({ onClose, onScanned }: ScannerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const resizeImage = (file: File, maxSize: number): Promise<{ base64: string; dataUrl: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const base64 = dataUrl.split(',')[1];
        resolve({ base64, dataUrl, mimeType: 'image/jpeg' });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('画像の読み込みに失敗しました'));
      };
      img.src = url;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setIsProcessing(true);
    try {
      const { base64, dataUrl, mimeType } = await resizeImage(file, 1600);
      const data = await scanBusinessCard(base64, mimeType);
      onScanned({
        name: data.name || '',
        company: data.company || '',
        title: data.title || '',
        phone: data.phone || '',
        email: data.email || '',
        memo: data.memo || '',
        imageUrl: dataUrl,
      });
      toast.success('スキャンが完了しました');
    } catch (err) {
      toast.error('名刺の読み取りに失敗しました。もう一度お試しください。');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      <div className="flex items-center justify-between p-6">
        <h2 className="text-xl font-medium tracking-tight">スキャン</h2>
        <button onClick={onClose} className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        {isProcessing ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="animate-spin text-muted-foreground" />
            <p className="text-muted-foreground text-sm tracking-widest uppercase">AI解析中...</p>
          </div>
        ) : (
          <>
            <div className="w-full max-w-sm aspect-[3/2] border border-border rounded-2xl flex items-center justify-center relative overflow-hidden bg-card">
              <div className="absolute inset-0 border-2 border-dashed border-muted-foreground/20 m-4 rounded-xl" />
              <p className="text-muted-foreground text-sm">名刺を枠内に収めてください</p>
            </div>

            <div className="flex gap-6">
              <button 
                onClick={() => cameraInputRef.current?.click()}
                className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
              >
                <Camera size={32} />
              </button>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
              >
                <ImageIcon size={32} />
              </button>
            </div>

            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              ref={cameraInputRef} 
              className="hidden" 
              onChange={handleFileChange} 
            />
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </>
        )}
      </div>
    </motion.div>
  );
}
