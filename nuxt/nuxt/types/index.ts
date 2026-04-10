// types/index.ts
export interface Feature {
  text: string;
  subtext?: string;
}

export interface Plan {
  id?: number;
  name?: string;
  title?: string;
  price?: string | number;
  oldPrice?: string | number;
  originalPrice?: string | number;
  yearlyPrice?: string | number;
  savings?: string | number;
  topColor?: string;
  savingsColor?: string;
  features: (Feature | string)[];
}

export interface CheckoutForm {
  cardNumber: string;
  expiry: string;
  cvc: string;
  fullName: string;
  address: string;
  consent: boolean;
  agreeToTerms?: boolean; // Якщо використовуєш таку назву
}
