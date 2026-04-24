import { BusinessCard } from '../types';

const API_BASE = '/api';

export async function fetchCards(): Promise<BusinessCard[]> {
  const res = await fetch(`${API_BASE}/cards`);
  if (!res.ok) throw new Error('Failed to fetch cards');
  return res.json();
}

export async function createCard(card: BusinessCard): Promise<void> {
  const res = await fetch(`${API_BASE}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  });
  if (!res.ok) throw new Error('Failed to create card');
}

export async function updateCard(id: string, data: Partial<BusinessCard>): Promise<void> {
  const res = await fetch(`${API_BASE}/cards/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update card');
}

export async function deleteCard(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/cards/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete card');
}

export async function scanBusinessCard(base64Image: string, mimeType: string): Promise<Partial<BusinessCard>> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image, mimeType }),
    });
  } catch (e) {
    throw new Error(`ネットワークエラー (${e instanceof Error ? e.message : String(e)})`);
  }
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) detail += ` - ${body.error}`;
    } catch {}
    throw new Error(detail);
  }
  return res.json();
}
