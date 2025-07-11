import { html, css, LitElement } from "lit";
import { CheckoutToken } from ".";

export class PayvaModal extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
    }

    :host([open]) {
      opacity: 1;
      visibility: visible;
    }

    .modal-content {
      background: white;
      width: 100vw;
      max-width: 576px;
      height: 100vh;
      max-height: 956px;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      position: relative;
      transform: scale(0.95);
      transition: transform 0.3s ease-in-out;
    }

    :host([open]) .modal-content {
      transform: scale(1);
    }

    iframe {
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 10px;
    }

    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #ff3b30;
      color: white;
      border: none;
      padding: 5px 10px;
      font-size: 16px;
      cursor: pointer;
      border-radius: 5px;
      transition: background 0.2s;
    }

    .close-btn:hover {
      background: #d32f2f;
    }
  `;

  static properties = {
    checkoutUrl: { type: String },
    // The checkout token details are stored as an object.
    checkoutToken: { type: Object },
    open: { type: Boolean, reflect: true },
  };

  checkoutUrl: string = "";
  checkoutToken: CheckoutToken | null = null;
  open: boolean = false;

  constructor() {
    super();
    this.checkoutUrl = "";
    this.checkoutToken = null;
    this.open = false;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("message", this.handleMessage);
    window.addEventListener("keydown", this.handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("message", this.handleMessage);
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  handleMessage = (event: MessageEvent) => {
    if (event.data?.action === "payva:checkout_complete") {
    //   console.log("✅ Checkout completed, closing modal...");
      this.closeModal();
    } else if (event.data?.action === "payva:close_modal") {
    //   console.log("🔹 Closing modal on request...");
      this.closeModal();
    }
  };

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && this.open) {
      this.closeModal();
    }
  };

  /**
   * Opens the modal by setting the checkout URL and token.
   * After rendering, if a token is provided, it is sent to the iframe via postMessage.
   *
   * @param checkout - Checkout details including URL and token.
   */
  createModal(checkout: CheckoutToken) {
    const { checkoutUrl } = checkout;
    if (!checkoutUrl) {
      console.error("❌ Error: No checkout URL provided.");
      return;
    }

    this.checkoutUrl = checkoutUrl;
    this.checkoutToken = checkout || null;
    this.open = true;
    this.setAttribute("open", "");

    requestAnimationFrame(() => {
      this.style.opacity = "1";
      this.style.visibility = "visible";
    //   console.log("✅ Modal should now be visible.");

      // If a token is provided, send it to the iframe via postMessage.
      if (checkout) {
        const iframe = this.shadowRoot?.querySelector("iframe");
        if (iframe && iframe.contentWindow) {
          const targetOrigin = new URL(checkoutUrl).origin;
          iframe.contentWindow.postMessage({ checkoutToken: checkout }, targetOrigin);
        //   console.log(`✅ Sent checkout token to iframe with targetOrigin: ${targetOrigin}`);
        }
      }
    });

    this.requestUpdate();
  }

  /**
   * Closes the modal by hiding it and removing the open attribute.
   */
  closeModal() {
    // console.log("🔹 Closing Modal");

    this.style.opacity = "0";
    this.style.visibility = "hidden";

    setTimeout(() => {
      this.open = false;
      this.removeAttribute("open");
      this.requestUpdate();
    }, 300);
  }

  render() {
    return html`
      <div>
        <div class="modal-content">
          <iframe
            src="${this.checkoutUrl}"
            allow="storage-access-by-user-activation"
          ></iframe>
        </div>
      </div>
    `;
  }
}


// Register the custom element only once
if (!customElements.get("payva-modal")) {
    // console.log("✅ Registering PayvaModal...");
  customElements.define("payva-modal", PayvaModal);
} else {
    // console.log("✅ PayvaModal already registered.");
}