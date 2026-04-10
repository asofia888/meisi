export interface BusinessCard {
  id: string;
  name: string;
  company: string;
  title: string;
  phone: string;
  email: string;
  memo: string;
  createdAt: number;
  imageUrl?: string;
}
