import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { BusinessCard } from '../types';

interface CardListProps {
  cards: BusinessCard[];
  onSelect: (card: BusinessCard) => void;
  isLoading: boolean;
}

export default function CardList({ cards, onSelect, isLoading }: CardListProps) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <p className="text-muted-foreground font-light">名刺がありません。<br/>右下のボタンから追加してください。</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
          onClick={() => onSelect(card)}
          className="p-4 rounded-2xl bg-card border border-border hover:bg-secondary transition-colors cursor-pointer flex items-center gap-4"
        >
          {card.imageUrl && (
            <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-secondary">
              <img src={card.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-medium tracking-tight truncate pr-4">{card.name || '名前なし'}</h3>
              <span className="text-xs text-muted-foreground shrink-0">
                {new Date(card.createdAt).toLocaleDateString('ja-JP')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground truncate">{card.company}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
