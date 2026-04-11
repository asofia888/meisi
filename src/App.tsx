/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { Toaster } from '../components/ui/sonner';
import { BusinessCard } from './types';
import { fetchCards, createCard, deleteCard } from './lib/api';
import CardList from './components/CardList';
import CardDetail from './components/CardDetail';
import Scanner from './components/Scanner';

export default function App() {
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<BusinessCard | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Load cards from API on mount
  useEffect(() => {
    fetchCards()
      .then(setCards)
      .catch((e) => console.error('Failed to fetch cards:', e));
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
    } catch (e) {
      console.error('Failed to save card:', e);
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      await deleteCard(id);
      setCards(prev => prev.filter(c => c.id !== id));
      setSelectedCard(null);
    } catch (e) {
      console.error('Failed to delete card:', e);
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
        <h1 className="text-2xl font-light tracking-tight mb-6">Contacts</h1>
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
      <CardList cards={filteredCards} onSelect={setSelectedCard} />

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
            key="detail"
            card={selectedCard}
            onBack={() => setSelectedCard(null)}
            onDelete={handleDeleteCard}
          />
        )}
        {isScannerOpen && (
          <Scanner 
            key="scanner"
            onClose={() => setIsScannerOpen(false)} 
            onScanned={handleAddCard} 
          />
        )}
      </AnimatePresence>

      <Toaster theme="dark" position="top-center" />
    </div>
  );
}
