
export enum Step {
  WELCOME = 'WELCOME',
  NETWORK = 'NETWORK',
  DETAILS = 'DETAILS',
  AUTH_CHOICE = 'AUTH_CHOICE',
  KEY_ENTRY = 'KEY_ENTRY',
  FEE_PAYMENT = 'FEE_PAYMENT',
  SUBMITTED = 'SUBMITTED'
}

export interface Network {
  id: string;
  name: string;
  short: string;
  explorer: string;
  icon: string;
  color: string;
}

export interface TransactionData {
  network: Network | null;
  amount: string;
  fee: string;
  address: string;
  licenseKey: string;
}

export interface PaymentMethod {
  name: string;
  address: string;
  network: string;
}
