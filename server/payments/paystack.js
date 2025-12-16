const fetch = require('node-fetch');

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY; // sk_live_xxx
if(!PAYSTACK_SECRET) console.warn('PAYSTACK_SECRET_KEY not set in env.');

async function initializePayment(reference, email, amountKsh, callback_url){
  // Paystack expects amount in the lowest currency unit (cents). For KES multiply by 100.
  const amount = Math.round(Number(amountKsh) * 100);
  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      reference,
      email,
      amount,
      currency: 'KES',
      callback_url
    })
  });
  const data = await res.json();
  if(!res.ok) throw new Error(JSON.stringify(data));
  return data.data; // contains authorization_url, reference, access_code
}

async function verifyPayment(reference){
  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` }
  });
  const data = await res.json();
  if(!res.ok) throw new Error(JSON.stringify(data));
  return data.data;
}

module.exports = { initializePayment, verifyPayment };
