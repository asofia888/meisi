import { useState, useEffect, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
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
      {/* Header & Search */}
      <div className="pt-12 pb-4 px-6 bg-background/80 backdrop-blur-xl border-b border-border z-10 shrink-0">
        <h1 className="text-2xl font-light tracking-tight mb-6">名刺管理</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="名前、会社名、メモで検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary text-secondary-foreground rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-1 focus:ring-ring transition-all"
          />
        </div>
      </div>

      {/* Main List */}
      <CardList cards={filteredCards} onSelect={setSelectedCard} isLoading={isLoading} />

      {/* Floating Action Button */}
      <button
        onClick={() => setIsScannerOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform z-20"
      >
        <Plus size={24} />
      </button>

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

      <Toaster theme="dark" position="top-center" />
    </div>
  );
}
