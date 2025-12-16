import { API_BASE } from "./config";

export async function initPaystack(email: string, amountKES: number) {
  const res = await fetch(`${API_BASE}/payments/paystack/init`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      amount: amountKES,
      currency: "KES",
    }),
  });

  if (!res.ok) {
    throw new Error("Paystack init failed");
  }

  return await res.json(); // { checkoutUrl, reference }
}

export async function verifyPaystack(reference: string) {
  const res = await fetch(`${API_BASE}/payments/paystack/verify/${reference}`);
  return await res.json();
}
