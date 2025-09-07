declare module '@cashfreepayments/cashfree-js' {
  interface CashfreeConfig {
    mode: 'production' | 'sandbox';
  }

  interface CashfreeInstance {
    // Add methods as needed based on Cashfree documentation
    [key: string]: any;
  }

  export function load(config: CashfreeConfig): Promise<CashfreeInstance>;
}

// Extend Window interface to include Cashfree
declare global {
  interface Window {
    Cashfree?: any;
  }
}
