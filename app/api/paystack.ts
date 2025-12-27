import { API_BASE } from "./config";

export async function initPaystack(email: string, amountKES: number) {
  const payload = {
    email,
    amount: Math.round(amountKES * 100), // Paystack expects kobo/cents
    currency: "KES",
    channels: ["card", "mobile_money"],
    metadata: {
      platform: "PixelPost Scheduler",
      purpose: "credits_purchase",
    },
  };

  const res = await fetch(`${API_BASE}/api/payments/paystack/init`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Paystack init failed: ${msg}`);
  }

  return await res.json(); // { checkoutUrl, reference }
}

export async function verifyPaystack(reference: string) {
  const res = await fetch(
    `${API_BASE}/api/payments/paystack/verify/${reference}`
  );

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Paystack verification failed: ${msg}`);
  }

  return await res.json();
}

