import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Phone, Mail, Building2, User, FileText, Trash2, Pencil, Check, X } from 'lucide-react';
import { BusinessCard } from '../types';

interface CardDetailProps {
  card: BusinessCard;
  onBack: () => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, data: Partial<BusinessCard>) => void;
}

export default function CardDetail({ card, onBack, onDelete, onUpdate }: CardDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editData, setEditData] = useState({
    name: card.name,
    company: card.company,
    title: card.title,
    phone: card.phone,
    email: card.email,
    memo: card.memo,
  });

  const handleSave = () => {
    onUpdate?.(card.id, editData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      name: card.name,
      company: card.company,
      title: card.title,
      phone: card.phone,
      email: card.email,
      memo: card.memo,
    });
    setIsEditing(false);
  };

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
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground"
                >
                  <X size={20} />
                </button>
                <button
                  onClick={handleSave}
                  className="p-2 rounded-full hover:bg-secondary transition-colors text-primary"
                >
                  <Check size={20} />
                </button>
              </>
            ) : (
              <>
                {onUpdate && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 rounded-full hover:bg-secondary transition-colors"
                  >
                    <Pencil size={20} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 rounded-full hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-8 pb-24">
        {/* Header Section */}
        <div className="space-y-2">
          {isEditing ? (
            <>
              <input
                value={editData.name}
                onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                placeholder="名前"
                className="w-full text-3xl font-light tracking-tight bg-transparent border-b border-border pb-2 outline-none focus:border-primary transition-colors"
              />
              <input
                value={editData.title}
                onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
                placeholder="役職"
                className="w-full text-lg text-muted-foreground bg-transparent border-b border-border pb-2 outline-none focus:border-primary transition-colors"
              />
              <input
                value={editData.company}
                onChange={e => setEditData(d => ({ ...d, company: e.target.value }))}
                placeholder="会社名"
                className="w-full text-lg font-medium bg-transparent border-b border-border pb-2 outline-none focus:border-primary transition-colors"
              />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-light tracking-tight">{card.name || '名前なし'}</h1>
              <p className="text-muted-foreground text-lg">{card.title}</p>
              <p className="text-lg font-medium">{card.company}</p>
            </>
          )}
        </div>

        {/* Image Section */}
        {card.imageUrl && (
          <div className="w-full aspect-[3/2] rounded-2xl overflow-hidden border border-border bg-card">
            <img src={card.imageUrl} alt="Business Card" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Actions Section */}
        {!isEditing && (
          <div className="grid grid-cols-2 gap-4">
            <a
              href={card.phone ? `tel:${card.phone.replace(/[^0-9+]/g, '')}` : undefined}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border border-border transition-colors ${card.phone ? 'bg-card hover:bg-secondary' : 'opacity-50 cursor-not-allowed'}`}
            >
              <Phone size={24} className="mb-2" />
              <span className="text-sm">発信</span>
            </a>
            <a
              href={card.email ? `mailto:${card.email}` : undefined}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border border-border transition-colors ${card.email ? 'bg-card hover:bg-secondary' : 'opacity-50 cursor-not-allowed'}`}
            >
              <Mail size={24} className="mb-2" />
              <span className="text-sm">メール</span>
            </a>
          </div>
        )}

        {/* Details Section */}
        <div className="space-y-6">
          {isEditing ? (
            <>
              <EditRow icon={<Phone size={20} />} label="電話番号" value={editData.phone} onChange={v => setEditData(d => ({ ...d, phone: v }))} />
              <EditRow icon={<Mail size={20} />} label="メールアドレス" value={editData.email} onChange={v => setEditData(d => ({ ...d, email: v }))} />
              <EditRow icon={<FileText size={20} />} label="メモ" value={editData.memo} onChange={v => setEditData(d => ({ ...d, memo: v }))} multiline />
            </>
          ) : (
            <>
              <DetailRow icon={<Building2 size={20} />} label="会社名" value={card.company} />
              <DetailRow icon={<User size={20} />} label="役職" value={card.title} />
              <DetailRow icon={<Phone size={20} />} label="電話番号" value={card.phone} />
              <DetailRow icon={<Mail size={20} />} label="メールアドレス" value={card.email} />
              <DetailRow icon={<FileText size={20} />} label="メモ" value={card.memo} />
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Overlay */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center p-6"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-sm space-y-3"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-card rounded-2xl overflow-hidden border border-border">
                <div className="p-4 text-center border-b border-border">
                  <p className="text-sm text-muted-foreground">この名刺を削除しますか？</p>
                  <p className="text-sm text-muted-foreground">この操作は取り消せません。</p>
                </div>
                <button
                  onClick={() => { setShowDeleteConfirm(false); onDelete?.(card.id); }}
                  className="w-full p-4 text-destructive font-medium text-center hover:bg-secondary transition-colors"
                >
                  削除する
                </button>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full p-4 bg-card rounded-2xl border border-border font-medium text-center hover:bg-secondary transition-colors"
              >
                キャンセル
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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

function EditRow({ icon, label, value, onChange, multiline }: { icon: React.ReactNode, label: string, value: string, onChange: (v: string) => void, multiline?: boolean }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-3 bg-secondary rounded-xl text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1 border-b border-border pb-4">
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{label}</p>
        {multiline ? (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={3}
            className="w-full text-base bg-transparent outline-none resize-none"
          />
        ) : (
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full text-base bg-transparent outline-none"
          />
        )}
      </div>
    </div>
  );
}
