const express = require('express');
const router = express.Router();
const { initializePayment, verifyPayment } = require('../payments/paystack');
const { createOrder, captureOrder } = require('../payments/paypal');
const crypto = require('crypto');

// Initialize Paystack payment
router.post('/paystack/init', async (req, res) => {
  try{
    const { email, amountKsh, callback_url } = req.body;
    const reference = 'ps_' + Date.now() + '_' + Math.random().toString(36).substr(2,6);
    const data = await initializePayment(reference, email, amountKsh, callback_url);
    res.json({ reference: data.reference, url: data.authorization_url });
  }catch(err){ res.status(400).json({ error: err.message || err }); }
});

// Verify Paystack
router.get('/paystack/verify/:reference', async (req,res)=>{
  try{
    const data = await verifyPayment(req.params.reference);
    res.json(data);
  }catch(err){ res.status(400).json({ error: err.message || err }); }
});

// Paystack webhook
router.post('/paystack/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET || '';
  const signature = req.headers['x-paystack-signature'];
  if(secret){
    const hash = crypto.createHmac('sha512', secret).update(req.body).digest('hex');
if(hash !== signature) return res.status(400).send('invalid signature');
  }
  const payload = JSON.parse(req.body.toString());
  console.log('Paystack webhook event:', payload.event);
  res.sendStatus(200);
});

// PayPal create order
router.post('/paypal/create', async (req,res)=>{
  try{
    const { amount, return_url, cancel_url } = req.body;
    const data = await createOrder(amount, 'KES', return_url, cancel_url);
    res.json(data);
  }catch(err){ res.status(400).json({ error: err.message || err }); }
});

// PayPal capture
router.post('/paypal/capture', async (req,res)=>{
  try{
    const { orderId } = req.body;
    const data = await captureOrder(orderId);
    res.json(data);
  }catch(err){ res.status(400).json({ error: err.message || err }); }
});

module.exports = router;
