// app/api/paypal.ts
import { API_BASE } from "./config";

export async function createPayPalOrder(
  amount: number,
  returnUrl: string,
  cancelUrl: string
) {
  const res = await fetch(`${API_BASE}/payments/paypal/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount,
      return_url: returnUrl,
      cancel_url: cancelUrl,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error || "Failed to create PayPal order");
  }

  return res.json();
}

export async function capturePayPalOrder(orderId: string) {
  const res = await fetch(`${API_BASE}/payments/paypal/capture`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error || "Failed to capture PayPal order");
  }

  return res.json();
}
