export class PayvaUI {
    /**
     * Creates and appends a BNPL button dynamically.
     * @param selector - The CSS selector where the button will be placed.
     * @param onClick - Function to execute when the button is clicked.
     */
    static createPaymentButton(selector: string, onClick: () => void) {
      const container = document.querySelector(selector);
  
      if (!container) {
        console.error(`BNPL SDK: Element ${selector} not found.`);
        return;
      }
  
      // Create button element
      const button = document.createElement("button");
      button.innerText = "Buy Now, Pay Later";
      button.className =
        "bg-blue-600 text-white font-semibold px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition";
  
      button.onclick = onClick;
  
      // Append button to container
      container.appendChild(button);
    }
  }