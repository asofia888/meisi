import { useState, useEffect, useMemo } from 'react';
import { Search, Plus, ScanLine } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Toaster } from '../components/ui/sonner';
import { toast } from 'sonner';
import { BusinessCard } from './types';
import { fetchCards, createCard, updateCard, deleteCard } from './lib/api';
import CardList from './components/CardList';
import CardDetail from './components/CardDetail';
import Scanner from './components/Scanner';

export default function App() {
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<BusinessCard | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    fetchCards()
      .then(setCards)
      .catch(() => toast.error('データの読み込みに失敗しました'))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddCard = async (newCardData: Omit<BusinessCard, 'id' | 'createdAt'>) => {
    const newCard: BusinessCard = {
      ...newCardData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    try {
      await createCard(newCard);
      setCards(prev => [newCard, ...prev]);
      setIsScannerOpen(false);
      setSelectedCard(newCard);
    } catch {
      toast.error('名刺の保存に失敗しました');
    }
  };

  const handleUpdateCard = async (id: string, data: Partial<BusinessCard>) => {
    try {
      await updateCard(id, data);
      setCards(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
      setSelectedCard(prev => prev && prev.id === id ? { ...prev, ...data } : prev);
      toast.success('名刺を更新しました');
    } catch {
      toast.error('名刺の更新に失敗しました');
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      await deleteCard(id);
      setCards(prev => prev.filter(c => c.id !== id));
      setSelectedCard(null);
      toast.success('名刺を削除しました');
    } catch {
      toast.error('名刺の削除に失敗しました');
    }
  };

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return cards;
    const query = searchQuery.toLowerCase();
    return cards.filter(card =>
      (card.name && card.name.toLowerCase().includes(query)) ||
      (card.company && card.company.toLowerCase().includes(query)) ||
      (card.memo && card.memo.toLowerCase().includes(query))
    );
  }, [cards, searchQuery]);

  return (
    <div className="flex flex-col h-[100dvh] bg-background text-foreground overflow-hidden">
      {/* Header */}
      <div className="glass border-b border-white/[0.06] z-10 shrink-0">
        <div className="pt-[env(safe-area-inset-top)] px-6">
          <div className="flex items-center justify-between pt-4 pb-3">
            <div>
              <h1 className="text-[28px] font-bold tracking-tight">名刺</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {cards.length > 0 ? `${cards.length} 件` : ''}
              </p>
            </div>
            <button
              onClick={() => setIsScannerOpen(true)}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
            >
              <ScanLine size={18} className="text-white" />
            </button>
          </div>

          {/* Search */}
          <div className="pb-3">
            <motion.div
              animate={{
                borderColor: isSearchFocused ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.04)',
              }}
              className="relative rounded-2xl border bg-white/[0.03] overflow-hidden"
            >
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full bg-transparent text-sm py-2.5 pl-10 pr-4 outline-none placeholder:text-muted-foreground/60"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main List */}
      <CardList cards={filteredCards} onSelect={setSelectedCard} isLoading={isLoading} />

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsScannerOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-8 right-6 w-14 h-14 bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/25 z-20"
      >
        <Plus size={22} className="text-white" />
      </motion.button>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {selectedCard && (
          <CardDetail
            card={selectedCard}
            onBack={() => setSelectedCard(null)}
            onDelete={handleDeleteCard}
            onUpdate={handleUpdateCard}
          />
        )}
        {isScannerOpen && (
          <Scanner
            onClose={() => setIsScannerOpen(false)}
            onScanned={handleAddCard}
          />
        )}
      </AnimatePresence>

      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(15, 15, 18, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
          },
        }}
      />
    </div>
  );
}
