import "./modal"; // ✅ Ensure Webpack includes modal.ts

export interface CheckoutToken {
  id: string | number;
  checkoutUrl: string;
  merchantId: string | number;
  platformOrderId: string;
  products: any[]; // adjust type as needed for your products
  amount: number;
  salesTax: number;
  redirectUrl: string;
  mode?: "light" | "dark"; // New optional property for dark/light mode
}

/**
 * Payva SDK Class
 *
 * This class handles the initialization of the checkout modal and registers
 * event callbacks for the checkout process.
 */
class Payva {
  private modal: HTMLElement | null;
  private callbacks: Record<"checkoutSuccess" | "checkoutFailure" | "checkoutClose", Function> = {
    checkoutSuccess: () => {},
    checkoutFailure: () => {},
    checkoutClose: () => {},
  };

  constructor() {
    // Environment check: Ensure SDK is running in a browser
    if (typeof window === "undefined") {
      throw new Error("Payva SDK can only be initialized in a browser environment.");
    }

    // Ensure the modal exists on the page
    const existingModal = document.querySelector("payva-modal");
    if (!existingModal) {
      console.log("🔹 payva-modal NOT found. Creating one...");
      this.modal = document.createElement("payva-modal") as HTMLElement;
      document.body.appendChild(this.modal);
    } else {
      console.log("🔹 payva-modal FOUND in DOM.");
      this.modal = existingModal as HTMLElement;
    }

    console.log("🔍 PayvaModal Reference:", this.modal);

    // Wait for the element to be fully defined before using it
    customElements.whenDefined("payva-modal").then(() => {
      console.log("✅ payva-modal is fully defined.");
      this.modal = document.querySelector("payva-modal") as HTMLElement;
    });

    window.addEventListener("message", this.handleCheckoutCompletion);
  }

  /**
   * Registers a callback for a given event.
   *
   * @param event - The event name ("checkoutSuccess", "checkoutFailure", "checkoutClose").
   * @param callback - The function to be called when the event occurs.
   */
  on(event: "checkoutSuccess" | "checkoutFailure" | "checkoutClose", callback: Function) {
    this.callbacks[event] = callback;
  }

  private handleCheckoutCompletion = (event: MessageEvent) => {
    if (event.data?.action === "payva:checkout_complete") {
      console.log("✅ Checkout completed!", event.data);
      (this.modal as any)?.closeModal?.();
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
   * The checkout argument includes the checkout URL, an optional token, and theme mode.
   *
   * @param checkout - An object containing checkout details.
   */
  async initiateCheckout(checkout: CheckoutToken) {
    if (checkout.checkoutUrl) {
      // Append the "mode" query parameter if provided (for dark/light mode)
      if (checkout.mode) {
        const urlObj = new URL(checkout.checkoutUrl);
        urlObj.searchParams.set("mode", checkout.mode);
        checkout.checkoutUrl = urlObj.toString();
        console.log(`🔹 Appended mode=${checkout.mode} to checkout URL: ${checkout.checkoutUrl}`);
      }

      console.log("🔹 Attempting to open modal with URL:", checkout.checkoutUrl);
      await customElements.whenDefined("payva-modal");
      console.log("✅ payva-modal is defined, calling createModal()");
      const modal = document.querySelector("payva-modal") as any;
      if (modal && typeof modal.createModal === "function") {
        modal.createModal(checkout);
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

// Attach Payva globally for browser usage (e.g., via a script tag)
if (typeof window !== "undefined") {
  (window as any).Payva = Payva;
}