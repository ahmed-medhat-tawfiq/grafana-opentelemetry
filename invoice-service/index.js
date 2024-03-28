const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Mocked data
const invoices = [
  { id: 1, clientId: 1, amount: 100 },
  { id: 2, clientId: 2, amount: 200 },
  { id: 3, clientId: 1, amount: 300 },
];

app.get('/invoices', (req, res) => {
  const { clientId } = req.query;
  const clientInvoices = invoices.filter(invoice => invoice.clientId == clientId);
  console.log(`Invoices requested for client ID: ${clientId}`);
  res.json(clientInvoices);
});

app.listen(PORT, () => {
  console.log(`Invoice Service running on port ${PORT}`);
});