export interface Address {
  id: string;
  userId?: string;
  title: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province: string;
  postalCode?: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

export interface User {
  id: string;
  email?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  nationalId?: string;
  birthDate?: string;
  role: 'CUSTOMER' | 'ADMIN';
  addresses?: Address[];
}

export interface AuthSession {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
