import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Phone, Mail, Building2, Briefcase, FileText, Trash2, Pencil, Check, X, Copy, ExternalLink } from 'lucide-react';
import { BusinessCard } from '../types';
import { toast } from 'sonner';

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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label}をコピーしました`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-40 bg-background overflow-y-auto"
    >
      {/* Top bar */}
      <div className="sticky top-0 glass border-b border-white/[0.06] z-10">
        <div className="pt-[env(safe-area-inset-top)]">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors -ml-1"
            >
              <ArrowLeft size={18} />
              <span>戻る</span>
            </button>
            <div className="flex items-center gap-1">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-white/[0.04] transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-400 transition-colors"
                  >
                    保存
                  </button>
                </>
              ) : (
                <>
                  {onUpdate && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 rounded-xl hover:bg-white/[0.04] transition-colors"
                    >
                      <Pencil size={18} className="text-muted-foreground" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="p-2 rounded-xl hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 size={18} className="text-destructive/70" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto pb-[env(safe-area-inset-bottom)] pb-24">
        {/* Profile Header */}
        <div className="px-6 pt-8 pb-6 text-center">
          {/* Avatar */}
          <div className="mx-auto mb-5 relative">
            {card.imageUrl ? (
              <div className="w-24 h-24 rounded-3xl overflow-hidden ring-2 ring-white/10 mx-auto shadow-2xl">
                <img src={card.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/20">
                <span className="text-3xl font-bold text-white">
                  {(card.name || '?')[0]}
                </span>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3">
              <input
                value={editData.name}
                onChange={e => setEditData(d => ({ ...d, name: e.target.value }))}
                placeholder="名前"
                className="w-full text-2xl font-bold tracking-tight bg-transparent text-center outline-none border-b border-white/10 pb-2 focus:border-blue-500/50 transition-colors"
              />
              <input
                value={editData.title}
                onChange={e => setEditData(d => ({ ...d, title: e.target.value }))}
                placeholder="役職"
                className="w-full text-sm text-muted-foreground bg-transparent text-center outline-none border-b border-white/10 pb-2 focus:border-blue-500/50 transition-colors"
              />
              <input
                value={editData.company}
                onChange={e => setEditData(d => ({ ...d, company: e.target.value }))}
                placeholder="会社名"
                className="w-full text-sm text-muted-foreground bg-transparent text-center outline-none border-b border-white/10 pb-2 focus:border-blue-500/50 transition-colors"
              />
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight">{card.name || '名前なし'}</h1>
              {card.title && <p className="text-sm text-muted-foreground mt-1">{card.title}</p>}
              {card.company && (
                <p className="text-sm text-blue-400/80 mt-0.5">{card.company}</p>
              )}
            </>
          )}
        </div>

        {/* Quick Actions */}
        {!isEditing && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-3">
              <a
                href={card.phone ? `tel:${card.phone.replace(/[^0-9+]/g, '')}` : undefined}
                className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl border transition-all duration-200 ${
                  card.phone
                    ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/15 active:scale-[0.97]'
                    : 'bg-white/[0.02] border-white/[0.04] text-muted-foreground/30 cursor-not-allowed'
                }`}
              >
                <Phone size={16} />
                <span className="text-sm font-medium">発信</span>
              </a>
              <a
                href={card.email ? `mailto:${card.email}` : undefined}
                className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl border transition-all duration-200 ${
                  card.email
                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/15 active:scale-[0.97]'
                    : 'bg-white/[0.02] border-white/[0.04] text-muted-foreground/30 cursor-not-allowed'
                }`}
              >
                <Mail size={16} />
                <span className="text-sm font-medium">メール</span>
              </a>
            </div>
          </div>
        )}

        {/* Details Card */}
        <div className="px-6">
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden divide-y divide-white/[0.04]">
            {isEditing ? (
              <>
                <EditRow icon={<Phone size={16} />} label="電話番号" value={editData.phone} onChange={v => setEditData(d => ({ ...d, phone: v }))} />
                <EditRow icon={<Mail size={16} />} label="メール" value={editData.email} onChange={v => setEditData(d => ({ ...d, email: v }))} />
                <EditRow icon={<FileText size={16} />} label="メモ" value={editData.memo} onChange={v => setEditData(d => ({ ...d, memo: v }))} multiline />
              </>
            ) : (
              <>
                <InfoRow icon={<Building2 size={16} />} label="会社" value={card.company} onCopy={() => copyToClipboard(card.company, '会社名')} />
                <InfoRow icon={<Briefcase size={16} />} label="役職" value={card.title} onCopy={() => copyToClipboard(card.title, '役職')} />
                <InfoRow icon={<Phone size={16} />} label="電話" value={card.phone} href={`tel:${card.phone.replace(/[^0-9+]/g, '')}`} onCopy={() => copyToClipboard(card.phone, '電話番号')} />
                <InfoRow icon={<Mail size={16} />} label="メール" value={card.email} href={`mailto:${card.email}`} onCopy={() => copyToClipboard(card.email, 'メールアドレス')} />
                <InfoRow icon={<FileText size={16} />} label="メモ" value={card.memo} onCopy={() => copyToClipboard(card.memo, 'メモ')} />
              </>
            )}
          </div>
        </div>

        {/* Card Image */}
        {card.imageUrl && !isEditing && (
          <div className="px-6 mt-6">
            <p className="text-xs text-muted-foreground/50 uppercase tracking-wider mb-3 px-1">名刺画像</p>
            <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-card">
              <img src={card.imageUrl} alt="名刺" className="w-full object-contain" />
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-xs space-y-2 pb-[env(safe-area-inset-bottom)]"
              onClick={e => e.stopPropagation()}
            >
              <div className="rounded-2xl overflow-hidden bg-[#1c1c1e] border border-white/[0.06]">
                <div className="px-6 py-5 text-center">
                  <p className="text-sm font-medium mb-1">名刺を削除</p>
                  <p className="text-xs text-muted-foreground">この操作は取り消せません</p>
                </div>
                <div className="border-t border-white/[0.06]">
                  <button
                    onClick={() => { setShowDeleteConfirm(false); onDelete?.(card.id); }}
                    className="w-full py-3.5 text-destructive text-sm font-medium text-center hover:bg-white/[0.04] transition-colors"
                  >
                    削除する
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full py-3.5 bg-[#1c1c1e] rounded-2xl border border-white/[0.06] text-sm font-semibold text-center hover:bg-white/[0.04] transition-colors"
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

function InfoRow({ icon, label, value, href, onCopy }: { icon: React.ReactNode; label: string; value: string; href?: string; onCopy?: () => void }) {
  if (!value) return null;

  return (
    <div className="group flex items-center gap-3.5 px-4 py-3.5 hover:bg-white/[0.02] transition-colors">
      <div className="text-muted-foreground/50">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">{label}</p>
        {href ? (
          <a href={href} className="text-sm text-blue-400 hover:text-blue-300 truncate block">{value}</a>
        ) : (
          <p className="text-sm truncate">{value}</p>
        )}
      </div>
      {onCopy && (
        <button
          onClick={(e) => { e.stopPropagation(); onCopy(); }}
          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/[0.06] transition-all"
        >
          <Copy size={13} className="text-muted-foreground" />
        </button>
      )}
    </div>
  );
}

function EditRow({ icon, label, value, onChange, multiline }: { icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div className="flex items-start gap-3.5 px-4 py-3.5">
      <div className="text-muted-foreground/50 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider mb-1">{label}</p>
        {multiline ? (
          <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={3}
            className="w-full text-sm bg-transparent outline-none resize-none placeholder:text-muted-foreground/30"
            placeholder={`${label}を入力...`}
          />
        ) : (
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full text-sm bg-transparent outline-none placeholder:text-muted-foreground/30"
            placeholder={`${label}を入力...`}
          />
        )}
      </div>
    </div>
  );
}
