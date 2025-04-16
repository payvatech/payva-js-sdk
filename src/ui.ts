/**
 * PayvaUI: A utility class for creating payment buttons.
 */
export class PayvaUI {
  /**
   * Creates and appends a BNPL button dynamically.
   *
   * @param selector - The CSS selector of the container element where the button will be inserted.
   * @param onClick - A function to execute when the button is clicked.
   */
  static createPaymentButton(selector: string, onClick: () => void) {
    const container = document.querySelector(selector);

    if (!container) {
      console.error(`BNPL SDK: Element ${selector} not found.`);
      return;
    }

    // Create the button element.
    const button = document.createElement("button");
    button.innerText = "Buy Now, Pay Later";
    button.className =
      "bg-blue-600 text-white font-semibold px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition";
  
    button.onclick = onClick;
  
    // Append the button to the container.
    container.appendChild(button);
  }
}