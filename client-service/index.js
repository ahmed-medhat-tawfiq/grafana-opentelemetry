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
  const span = tracer.startSpan('handle /client/:id/invoices');
  const currentSpan = trace.getSpan(trace.getSpanContext(context.active()));
  const traceId = currentSpan ? currentSpan.spanContext().traceId : 'undefined';
  const spanId = currentSpan ? currentSpan.spanContext().spanId : 'undefined';

  console.log(JSON.stringify({
    traceId,
    spanId,
    msg: 'Get Invoice for client' + req.params.id
  }));

  try {
    const { id } = req.params;
    // Wrap external calls or significant operations in child spans
    span.addEvent('Fetching client invoices');

    console.log(JSON.stringify({
      traceId,
      spanId,
      msg: 'Fetching invoices for client: ' + id
    }));

    const response = await axios.get(`http://invoice-service:3000/invoices?clientId=${id}`);

    // Simulate processing
    span.addEvent('Processing invoices for client');

    console.log(JSON.stringify({
      traceId,
      spanId,
      msg: 'Client invoices: ' + response.data
    }));

    res.json(response.data);
    span.setStatus({ code: SpanStatusCode.OK });
  } catch (error) {

    console.error(JSON.stringify({
      traceId,
      spanId,
      msg: 'Failed to fetch client invoices' + error.message
    }));

    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    res.status(500).send("Failed to fetch client's invoices");
  } finally {
    span.end(); // Ensure the span is ended
  }
});

app.listen(PORT, () => {
  console.log(`Client Service running on port ${PORT}`);
});
