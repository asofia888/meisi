import { motion } from 'motion/react';
import { User } from 'lucide-react';
import { BusinessCard } from '../types';

interface CardListProps {
  cards: BusinessCard[];
  onSelect: (card: BusinessCard) => void;
  isLoading: boolean;
}

export default function CardList({ cards, onSelect, isLoading }: CardListProps) {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 rounded-2xl bg-card border border-white/[0.04] flex items-center gap-4">
            <div className="w-11 h-11 rounded-full shimmer shrink-0" />
            <div className="flex-1 space-y-2.5">
              <div className="h-4 w-32 rounded-lg shimmer" />
              <div className="h-3 w-24 rounded-lg shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4">
        <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
          <User size={32} className="text-muted-foreground/40" />
        </div>
        <div>
          <p className="text-muted-foreground font-medium text-sm">名刺がありません</p>
          <p className="text-muted-foreground/60 text-xs mt-1">右下の + ボタンで追加</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => onSelect(card)}
          className="group p-4 rounded-2xl bg-card/60 border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300 cursor-pointer flex items-center gap-4 active:scale-[0.98]"
        >
          {/* Avatar */}
          <div className="shrink-0">
            {card.imageUrl ? (
              <div className="w-11 h-11 rounded-full overflow-hidden ring-1 ring-white/10">
                <img src={card.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--gradient-start)]/20 to-[var(--gradient-end)]/20 flex items-center justify-center ring-1 ring-white/10">
                <span className="text-sm font-semibold text-white/70">
                  {(card.name || '?')[0]}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-semibold tracking-tight truncate group-hover:text-white transition-colors">
              {card.name || '名前なし'}
            </h3>
            {card.company && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">{card.company}</p>
            )}
          </div>

          {/* Date */}
          <span className="text-[10px] text-muted-foreground/50 shrink-0 tabular-nums">
            {formatDate(card.createdAt)}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '今日';
  if (diffDays === 1) return '昨日';
  if (diffDays < 7) return `${diffDays}日前`;
  return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
}
