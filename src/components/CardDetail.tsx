import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Phone, Mail, Building2, User, FileText, Trash2 } from 'lucide-react';
import { BusinessCard } from '../types';

interface CardDetailProps {
  key?: string;
  card: BusinessCard;
  onBack: () => void;
  onDelete?: (id: string) => void;
}

export default function CardDetail({ card, onBack, onDelete }: CardDetailProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-40 bg-background overflow-y-auto"
    >
      <div className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors">
            <ArrowLeft size={24} />
          </button>
          {onDelete && (
            <button
              onClick={() => { if (confirm('この名刺を削除しますか？')) onDelete(card.id); }}
              className="p-2 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-8 pb-24">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-light tracking-tight">{card.name || '名前なし'}</h1>
          <p className="text-muted-foreground text-lg">{card.title}</p>
          <p className="text-lg font-medium">{card.company}</p>
        </div>

        {/* Image Section */}
        {card.imageUrl && (
          <div className="w-full aspect-[3/2] rounded-2xl overflow-hidden border border-border bg-card">
            <img src={card.imageUrl} alt="Business Card" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Actions Section */}
        <div className="grid grid-cols-2 gap-4">
          <a 
            href={card.phone ? `tel:${card.phone.replace(/[^0-9+]/g, '')}` : '#'}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border border-border transition-colors ${card.phone ? 'bg-card hover:bg-secondary' : 'opacity-50 cursor-not-allowed'}`}
          >
            <Phone size={24} className="mb-2" />
            <span className="text-sm">発信</span>
          </a>
          <a 
            href={card.email ? `mailto:${card.email}` : '#'}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border border-border transition-colors ${card.email ? 'bg-card hover:bg-secondary' : 'opacity-50 cursor-not-allowed'}`}
          >
            <Mail size={24} className="mb-2" />
            <span className="text-sm">メール</span>
          </a>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <DetailRow icon={<Building2 size={20} />} label="会社名" value={card.company} />
          <DetailRow icon={<User size={20} />} label="役職" value={card.title} />
          <DetailRow icon={<Phone size={20} />} label="電話番号" value={card.phone} />
          <DetailRow icon={<Mail size={20} />} label="メールアドレス" value={card.email} />
          <DetailRow icon={<FileText size={20} />} label="メモ" value={card.memo} />
        </div>
      </div>
    </motion.div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4">
      <div className="p-3 bg-secondary rounded-xl text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1 border-b border-border pb-4">
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{label}</p>
        <p className="text-base whitespace-pre-wrap">{value}</p>
      </div>
    </div>
  );
}
