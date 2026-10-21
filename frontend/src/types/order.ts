import { Product } from './product';

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface OrderItem {
  id: string;
  orderId?: string;
  productId?: string | null;
  product?: Product | null;
  productName: string;
  productImage?: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  cashbackEarned?: number | null;
}

export interface OrderTimeline {
  id: string;
  status: OrderStatus;
  note?: string | null;
  createdAt: string;
}

export interface ShippingAddressData {
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  province?: string;
  postalCode?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerPhone?: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'ONLINE' | 'CARD_TO_CARD' | 'WALLET' | 'CASH_ON_DELIVERY';
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  currency: string;
  shippingAmount: number;
  walletAmountPaid: number;
  totalAmount: number;
  shippingAddress: ShippingAddressData;
  shippingMethod?: string | null;
  trackingNumber?: string | null;
  items: OrderItem[];
  timeline?: OrderTimeline[];
  createdAt: string;
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: ShippingAddressData;
  shippingMethod?: string;
  paymentMethod: string;
  useWalletBalance?: boolean;
  referralCode?: string;
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
}
