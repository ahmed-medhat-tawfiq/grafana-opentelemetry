const express = require('express');
const uuid = require('uuid');
const axios = require('axios');

const app = express();

// Middleware to parse JSON data
app.use(express.json());

// GET /healthcheck endpoint
app.get('/healthcheck', (req, res) => {
  res.sendStatus(200);
});

// POST /invoices endpoint
app.post('/invoices', (req, res) => {
  const { name, amount, clientId } = req.body;

  // Generate invoice key (you can replace this with your own logic)
  const invoiceKey = generateInvoiceKey();

  // Return the invoice key
  res.json({ invoiceKey });
});

// Helper function to generate invoice key
function generateInvoiceKey() {
  return uuid.v4();
}

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});