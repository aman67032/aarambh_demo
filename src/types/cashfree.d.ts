declare module '@cashfreepayments/cashfree-js' {
  interface CheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: '_self' | '_blank';
  }

  interface CashfreeInstance {
    checkout(options: CheckoutOptions): Promise<void>;
  }

  interface LoadOptions {
    mode: 'production' | 'sandbox';
  }

  export function load(options: LoadOptions): Promise<CashfreeInstance>;
}
