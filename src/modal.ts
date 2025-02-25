import { html, css, LitElement } from "lit";

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
        open: { type: Boolean, reflect: true },
    };

    checkoutUrl: string = "";
    open: boolean = false;

    constructor() {
        super();
        this.checkoutUrl = "";
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
            console.log("✅ Checkout completed, closing modal...");
            this.closeModal();
        } else if (event.data?.action === "payva:close_modal") {
            console.log("🔹 Closing modal on request...");
            this.closeModal();
        }
    };

    handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape" && this.open) {
            this.closeModal();
        }
    };

    createModal(url: string) {
        console.log("🔹 Opening Modal with URL:", url);

        this.checkoutUrl = url;
        this.open = true;
        this.setAttribute("open", "");

        requestAnimationFrame(() => {
            this.style.opacity = "1";
            this.style.visibility = "visible";
            console.log("✅ Modal should now be visible.");
        });

        this.requestUpdate();
    }

    closeModal() {
        console.log("🔹 Closing Modal");

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
                    <iframe src="${this.checkoutUrl}"></iframe>
                </div>
            </div>
        `;
    }
}

console.log("✅ PayvaModal file is being executed.");
// ✅ Ensure modal is registered only once
if (!customElements.get("payva-modal")) {
    console.log("✅ Registering PayvaModal...");
    customElements.define("payva-modal", PayvaModal);
} else {
    console.log("✅ PayvaModal already registered.");
}