const TOKEN_KEY = 'sodaneh_auth_token';
const USER_KEY = 'sodaneh_user';
const CART_KEY = 'sodaneh_cart';
const ADDRESS_KEY = 'sodaneh_selected_address';

export const storage = {
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },
  removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  },

  getUser<T>(): T | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },
  setUser<T>(user: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  removeUser(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_KEY);
  },

  getSelectedAddress(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(ADDRESS_KEY) || '';
  },
  setSelectedAddress(addr: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ADDRESS_KEY, addr);
  },

  getCart<T>(): T | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : null;
  },
  setCart<T>(cart: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  },
};
