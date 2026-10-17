import { notFound } from 'next/navigation';
import SodanehApp from '../../components/SodanehApp';

const pageByRoute = {
  '': 'home',
  special: 'special',
  products: 'products',
  'products/rice': 'product',
  cart: 'cart',
  checkout: 'checkout',
  rewards: 'rewards',
  'rewards/transactions': 'rewardTransactions',
  orders: 'orders',
  'orders/10248': 'orderDetail',
  account: 'account',
  'account/profile': 'profile',
  'account/addresses': 'addresses',
  notifications: 'notifications',
  legal: 'legal',
  support: 'support',
  register: 'register',
  landing: 'landing'
};

export function generateStaticParams() {
  return Object.keys(pageByRoute)
    .filter(Boolean)
    .map((route) => ({ route: route.split('/') }));
}

export default async function SodanehPage({ params }) {
  const resolvedParams = await params;
  const route = (resolvedParams?.route || []).join('/');
  const page = pageByRoute[route];
  if (!page) notFound();
  return <SodanehApp page={page} />;
}
