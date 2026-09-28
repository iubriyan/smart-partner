// LocalStorage helper for SmartPartner

export interface Investor {
  id: string;
  name: string;
  amount: number;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  buyPrice: number;
  extraCost: number;
  date: string;
}

export interface Order {
  id: string;
  customerName: string;
  mobile: string;
  productName: string;
  quantity: number;
  sellPrice: number;
  profit: number;
  courierCharge: number;
  status: 'Delivered' | 'Returned' | 'Pending';
  date: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  time: string;
}

export interface Member {
  name: string;
  email: string;
  pass: string;
}

// Helper functions
export const getData = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
};

export const saveData = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};