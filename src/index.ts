import "./modal"; // ✅ Ensure Webpack includes modal.ts\

export interface CheckoutToken {
    id: string | number;
    merchantId: string | number;
    platformOrderId: string;
    products: any[]; // adjust type as needed for your products
    amount: number;
    salesTax: number;
    redirectUrl: string;
  }

class Payva {
    private modal: HTMLElement | null;
    private callbacks: Record<string, Function> = {};

    constructor() {
        // ✅ Ensure the modal exists
        let existingModal = document.querySelector("payva-modal");
        if (!existingModal) {
            console.log("🔹 payva-modal NOT found. Creating one...");
            this.modal = document.createElement("payva-modal") as HTMLElement;
            document.body.appendChild(this.modal);
        } else {
            console.log("🔹 payva-modal FOUND in DOM.");
            this.modal  = existingModal as HTMLElement;
        }
    
        // ✅ Log the modal reference
        console.log("🔍 PayvaModal Reference:", this.modal);
    
        // ✅ Wait for the element to be fully defined before using it
        customElements.whenDefined("payva-modal").then(() => {
            console.log("✅ payva-modal is fully defined.");
            this.modal = document.querySelector("payva-modal") as HTMLElement;
        });

        window.addEventListener("message", this.handleCheckoutCompletion);
    }

    /**
     * 🔹 Register callback functions
     */
    on(event: "checkoutSuccess" | "checkoutFailure" | "checkoutClose", callback: Function) {
        this.callbacks[event] = callback;
    }

    private handleCheckoutCompletion = (event: MessageEvent) => {
        if (event.data?.action === "payva:checkout_complete") {
            console.log("✅ Checkout completed!", event.data);
            (this.modal as any)?.closeModal?.();

            // ✅ Call the registered callback (if any)
            if (this.callbacks["checkoutSuccess"]) {
                this.callbacks["checkoutSuccess"](event.data.data);
            }
        } else if (event.data?.action === "payva:checkout_failed") {
            console.log("❌ Checkout failed!");
            (this.modal as any)?.closeModal?.();

            if (this.callbacks["checkoutFailure"]) {
                this.callbacks["checkoutFailure"](event.data.data);
            }
        } else if (event.data?.action === "payva:checkout_closed") {
            console.log("🔹 Checkout modal closed.");
            
            if (this.callbacks["checkoutClose"]) {
                this.callbacks["checkoutClose"]();
            }
        }
    };

    /**
   * Initiates the checkout flow by opening the modal.
   * The checkout argument includes the checkoutUrl and an optional token
   * (in the form of a CheckoutToken object).
   */
  async initiateCheckout(checkout: { checkoutUrl: string; token?: CheckoutToken }) {
    if (checkout.checkoutUrl) {
      console.log("🔹 Attempting to open modal with URL:", checkout.checkoutUrl);
      await customElements.whenDefined("payva-modal");
      console.log("✅ payva-modal is defined, calling createModal()");
      const modal = document.querySelector("payva-modal") as any;
      if (modal && typeof modal.createModal === "function") {
        modal.createModal(checkout.checkoutUrl, checkout.token);
      } else {
        console.error("❌ PayvaModal is not properly initialized.");
      }
    } else {
      console.error("❌ Error: No checkout URL returned.");
    }
  }
}

export { Payva };
export default Payva;

// ✅ Attach Payva globally for browser usage
if (typeof window !== "undefined") {
    (window as any).Payva = Payva;
}