
import { Network, PaymentMethod } from './types';

export const NETWORKS: Network[] = [
  { id: 'trc20', name: 'TRON (TRC-20)', short: 'TRC20', explorer: 'tronscan.org', icon: 'TRX', color: '#ef4444' },
  { id: 'erc20', name: 'Ethereum (ERC-20)', short: 'ERC20', explorer: 'etherscan.io', icon: 'ETH', color: '#6366f1' },
  { id: 'bep20', name: 'BNB Smart Chain (BEP-20)', short: 'BEP20', explorer: 'bscscan.com', icon: 'BNB', color: '#f59e0b' },
  { id: 'solana', name: 'Solana (SPL)', short: 'SOL', explorer: 'solscan.io', icon: 'SOL', color: '#14f195' },
];

export const PLANS = [
  { amount: '3k', fee: '20' },
  { amount: '5k', fee: '27' },
  { amount: '10k', fee: '40' },
  { amount: '20k', fee: '70' },
  { amount: '50k', fee: '130' },
  { amount: '100k', fee: '210' },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { name: 'USDT (TRC20)', network: 'TRON', address: 'TN2gWESUpCsYc4McWie6FuMYXrV4c5X4Jh' },
  { name: 'USDT (BEP20)', network: 'BSC', address: '0xd2b3efadfd91509b246e4f8c817102408232fe77' },
  { name: 'ETH (ERC20)', network: 'Ethereum', address: '0xd2b3efadfd91509b246e4f8c817102408232fe77' },
  { name: 'BTC', network: 'Bitcoin', address: 'bc1q06s7hjqrmgweg88n6z44gtpa5c3lf03n3qdd8g' },
  { name: 'SOL', network: 'Solana', address: '5AKimsRxXjBb6VnMM695LXKQkw6mj5ebN9eMjMhry7bx' },
];

export const EXCHANGE_LOGOS = [
  { name: 'Binance', url: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.svg' },
  { name: 'Bitget', url: 'https://seeklogo.com/images/B/bitget-logo-C717013531-seeklogo.com.png' },
  { name: 'OKX', url: 'https://cryptologos.cc/logos/okb-okb-logo.svg' },
  { name: 'MEXC', url: 'https://upload.wikimedia.org/wikipedia/commons/d/da/MEXC_logo.png' },
  { name: 'Quotex', url: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/Quotex_Logo.png' },
];

export const ALL_SUPPORTED_NAMES = [
  "Binance", "Bitget", "OKX", "MEXC", "Quotex", "Trust Wallet", "MetaMask", "Coinbase", "Bybit", "Gate.io", "KuCoin"
];

export const LICENSE_KEY_VALID = 'sqlhacker123';
export const TELEGRAM_SUPPORT = 'https://t.me/flashusdt198';
