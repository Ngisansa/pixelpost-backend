import { API_BASE } from "./config";

export async function initPaystack(email: string, amountKES: number) {
  const payload = {
    email,
    amount: Math.round(amountKES * 100),
    currency: "KES",
  };

  const res = await fetch(`${API_BASE}/payments/paystack/init`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Paystack init failed");
  }

  return await res.json(); // { checkoutUrl, reference }
}

export async function verifyPaystack(reference: string) {
  const res = await fetch(
    `${API_BASE}/payments/paystack/verify/${reference}`
  );

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Paystack verification failed");
  }

  return await res.json();
}
