Payva API Documentation

Version: 1.0
Base URL: https://api.payva.com
Authentication: Bearer Token (API Key)
Format: JSON API

Overview

Payva allows merchants to offer Buy Now, Pay Later (BNPL) payments through a seamless API integration. This guide outlines how to securely create a checkout session and launch the Payva checkout.

📌 Integration Flow
	1.	Merchant backend calls Payva API (POST /create-checkout).
	2.	Payva backend returns a checkout_url for the transaction.
	3.	Merchant frontend initializes Payva SDK with the returned URL.
	4.	User completes payment within the Payva modal.
	5.	Payva sends a webhook notification when payment is completed, also there are callback functions that you can use for immediate responses.

1️⃣ Create a Checkout Session

	Endpoint:
POST /create-checkout

Use this endpoint to create a checkout session before launching Payva’s modal. This ensures secure transactions by validating amounts and customer details on your backend.

📝 Request

POST https://api.payva.com/create-checkout
Authorization: Bearer {API_KEY}
Content-Type: application/json

🔹 Request Body

{
  "order_id": "order_12345",
  "amount": 150.00,
  "currency": "USD",
  "customer": {
    "id": "cust_001",
    "name": "John Doe",
    "email": "johndoe@example.com"
  },
  "items": [
    {
      "id": "prod_1",
      "name": "Laptop",
      "price": 100.00
    },
    {
      "id": "prod_2",
      "name": "Keyboard",
      "price": 50.00
    }
  ],
  "callback_url": "https://yourstore.com/payment-success",
  "webhook_url": "https://yourstore.com/webhooks/payva"
}

✅ Response

{
  "checkout_id": "chk_123abc",
  "checkout_url": "https://checkout.payva.com/session/chk_123abc",
  "expires_at": "2025-03-10T15:00:00Z"
}

🔹 Response Fields

Field	Type	Description
checkout_id	string	Unique identifier for the checkout session.
checkout_url	string	URL to launch the Payva checkout modal.
expires_at	string (ISO 8601)	Time when the checkout session expires.

2️⃣ Launch the Payva Checkout Modal

Once you receive the checkout_url, use the Payva JavaScript SDK to open the payment modal.

🔹 Example Implementation (Frontend)

import Payva from "payva-js-sdk";

const payva = new Payva("your-api-key");

const checkoutUrl = "https://checkout.payva.com/session/chk_123abc";
payva.initiateCheckout(checkoutUrl);

✅ The Payva modal will open, allowing users to complete payment securely.

3️⃣ Handling Payment Completion

After a user completes payment, Payva will notify your backend via webhook.

📢 Webhook Event: payva.checkout.completed

	Endpoint:
POST /webhooks/payva

🔹 Example Webhook Payload

{
  "event": "payva.checkout.completed",
  "checkout_id": "chk_123abc",
  "order_id": "order_12345",
  "amount": 150.00,
  "currency": "USD",
  "status": "approved",
  "payment_method": "credit_card",
  "timestamp": "2025-03-10T15:05:00Z"
}

🔹 Webhook Response

Your server must respond with HTTP 200 OK within 5 seconds.

✅ If Payva doesn’t receive a 200 OK, it will retry the webhook.

4️⃣ Retrieve Checkout Details

If you need to verify a checkout session, use the GET Checkout API.

📌 Endpoint

GET https://api.payva.com/checkout/{checkout_id}
Authorization: Bearer {API_KEY}

✅ Response

{
  "checkout_id": "chk_123abc",
  "order_id": "order_12345",
  "amount": 150.00,
  "currency": "USD",
  "status": "approved",
  "customer": {
    "id": "cust_001",
    "name": "John Doe",
    "email": "johndoe@example.com"
  }
}

✅ Use this API to check the status of a checkout session.

5️⃣ Refund a Transaction

	Endpoint:
POST /refund

📝 Request

{
  "checkout_id": "chk_123abc",
  "amount": 150.00,
  "reason": "Customer requested refund"
}

✅ Response

{
  "refund_id": "ref_789xyz",
  "status": "pending"
}

✅ Refunds can take 3-5 business days to process.

📌 Summary of API Endpoints

Endpoint	Method	Description
/create-checkout	POST	Creates a new checkout session.
/checkout/{checkout_id}	GET	Retrieves checkout details.
/refund	POST	Refunds a transaction.

📌 Integration Checklist

✅ Step 1: Call POST /create-checkout from your backend.
✅ Step 2: Use checkout_url to launch Payva modal via SDK.
✅ Step 3: Handle webhooks (payva.checkout.completed).
✅ Step 4: Retrieve order status (GET /checkout/{checkout_id}).
✅ Step 5: Refunds (POST /refund) if necessary.

🚀 Now your platform is fully integrated with Payva! 🎯

💡 Need Help?

📧 Support: support@payva.com
📖 Docs: docs.payva.com
