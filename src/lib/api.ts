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
  const res = await fetch(`${API_BASE}/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image, mimeType }),
  });
  if (!res.ok) throw new Error('Failed to scan business card');
  return res.json();
}
