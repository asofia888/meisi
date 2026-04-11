import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Camera, X, Loader2, Image as ImageIcon, ScanLine, Sparkles } from 'lucide-react';
import { scanBusinessCard } from '../lib/api';
import { BusinessCard } from '../types';
import { toast } from 'sonner';

interface ScannerProps {
  onClose: () => void;
  onScanned: (card: Omit<BusinessCard, 'id' | 'createdAt'>) => void;
}

export default function Scanner({ onClose, onScanned }: ScannerProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const mimeType = file.type;

        try {
          const data = await scanBusinessCard(base64String, mimeType);
          onScanned({
            name: data.name || '',
            company: data.company || '',
            title: data.title || '',
            phone: data.phone || '',
            email: data.email || '',
            memo: data.memo || '',
            imageUrl: reader.result as string,
          });
          toast.success('スキャンが完了しました');
        } catch (err) {
          toast.error('名刺の読み取りに失敗しました');
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setIsProcessing(false);
      toast.error('エラーが発生しました');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 bg-background flex flex-col"
    >
      {/* Header */}
      <div className="glass border-b border-white/[0.06]">
        <div className="pt-[env(safe-area-inset-top)]">
          <div className="flex items-center justify-between px-5 py-3">
            <h2 className="text-lg font-semibold tracking-tight">スキャン</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-10">
        {isProcessing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--gradient-start)]/20 to-[var(--gradient-end)]/20 flex items-center justify-center">
                <Sparkles size={36} className="text-blue-400 animate-pulse" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 rounded-[28px] border border-blue-500/20 border-t-blue-500/60"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium mb-1">AI解析中</p>
              <p className="text-xs text-muted-foreground">名刺情報を抽出しています...</p>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Scan Area */}
            <div className="w-full max-w-sm">
              <div className="aspect-[16/10] rounded-3xl border border-white/[0.06] bg-white/[0.02] relative overflow-hidden">
                {/* Corner markers */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-blue-400/60 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-blue-400/60 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-blue-400/60 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-blue-400/60 rounded-br-lg" />

                {/* Scan line animation */}
                <motion.div
                  animate={{ y: [0, 160, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent top-8"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <ScanLine size={28} className="text-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground/50">名刺を撮影またはアップロード</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-5">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.06] active:scale-95 transition-all">
                  <ImageIcon size={24} className="text-muted-foreground" />
                </div>
                <span className="text-[10px] text-muted-foreground/60">ライブラリ</span>
              </button>

              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center shadow-xl shadow-blue-500/25 hover:opacity-90 active:scale-95 transition-all">
                  <Camera size={28} className="text-white" />
                </div>
                <span className="text-[10px] text-muted-foreground/60">撮影</span>
              </button>

              <div className="w-16" />
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
