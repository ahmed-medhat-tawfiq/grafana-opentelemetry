const express = require('express');
const axios = require('axios');
const app = express();
const { trace, SpanStatusCode } = require('@opentelemetry/api');
const PORT = process.env.PORT || 3000;
require('./tracing');

// Mock data
const clients = [
  { id: 1, name: 'Client A' },
  { id: 2, name: 'Client B' },
];

// curl http://localhost:3001/clients/1/invoices
app.get('/clients/:id/invoices', async (req, res) => {

  const tracer = trace.getTracer('client-service');

  // Start a new trace with a root span for this request
  const span = tracer.startSpan('handle /client/:id/invoices');
  try {
    const { id } = req.params;
    // Wrap external calls or significant operations in child spans
    span.addEvent('Fetching client invoices');
    const response = await axios.get(`http://invoice-service:3000/invoices?clientId=${id}`);

    // Simulate processing
    span.addEvent('Processing invoices for client');

    res.json(response.data);
    span.setStatus({ code: SpanStatusCode.OK });
  } catch (error) {
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    res.status(500).send("Failed to fetch client's invoices");
  } finally {
    span.end(); // Ensure the span is ended
  }
});

app.listen(PORT, () => {
  console.log(`Client Service running on port ${PORT}`);
});
