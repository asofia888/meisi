import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// GET /api/cards - 全名刺取得
router.get('/', (_req: Request, res: Response) => {
  const cards = db.prepare(`
    SELECT id, name, company, title, phone, email, memo, image_url as imageUrl, created_at as createdAt
    FROM cards ORDER BY created_at DESC
  `).all();
  res.json(cards);
});

// GET /api/cards/:id - 名刺1件取得
router.get('/:id', (req: Request, res: Response) => {
  const card = db.prepare(`
    SELECT id, name, company, title, phone, email, memo, image_url as imageUrl, created_at as createdAt
    FROM cards WHERE id = ?
  `).get(req.params.id);
  if (!card) return res.status(404).json({ error: 'Card not found' });
  res.json(card);
});

// POST /api/cards - 名刺作成
router.post('/', (req: Request, res: Response) => {
  const { id, name, company, title, phone, email, memo, imageUrl, createdAt } = req.body;
  db.prepare(`
    INSERT INTO cards (id, name, company, title, phone, email, memo, image_url, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, name || '', company || '', title || '', phone || '', email || '', memo || '', imageUrl || null, createdAt);
  res.status(201).json({ id });
});

// PUT /api/cards/:id - 名刺更新
router.put('/:id', (req: Request, res: Response) => {
  const { name, company, title, phone, email, memo } = req.body;
  const result = db.prepare(`
    UPDATE cards SET name = ?, company = ?, title = ?, phone = ?, email = ?, memo = ?
    WHERE id = ?
  `).run(name || '', company || '', title || '', phone || '', email || '', memo || '', req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Card not found' });
  res.json({ ok: true });
});

// DELETE /api/cards/:id - 名刺削除
router.delete('/:id', (req: Request, res: Response) => {
  const result = db.prepare('DELETE FROM cards WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Card not found' });
  res.json({ ok: true });
});

export default router;
