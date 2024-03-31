require('./tracing'); // Make sure to require the tracing setup at the top

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { trace, SpanStatusCode } = require('@opentelemetry/api');

// Mocked data
const invoices = [
  { id: 1, clientId: 1, amount: 100 },
  { id: 2, clientId: 2, amount: 200 },
  { id: 3, clientId: 1, amount: 300 },
];

app.get('/invoices', (req, res) => {
  const tracer = trace.getTracer('invoice-service');
  const span = tracer.startSpan('handle /invoices');

  const currentSpan = trace.getSpan(trace.getSpanContext(context.active()));
  const traceId = currentSpan ? currentSpan.spanContext().traceId : 'undefined';
  const spanId = currentSpan ? currentSpan.spanContext().spanId : 'undefined';

  const { clientId } = req.query;
  try {
    const clientInvoices = invoices.filter(invoice => invoice.clientId == clientId);
    console.log(JSON.stringify({
      traceId,
      spanId,
      msg: `Invoices requested for client ID: ${clientId}`
    }));

    span.addEvent('Invoices processed');
    res.json(clientInvoices);
    span.setStatus({ code: SpanStatusCode.OK });
  } catch (error) {
    console.error(JSON.stringify({
      traceId,
      spanId,
      msg: `Error processing invoices for client ID: ${clientId}` + error.message
    }));
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
    res.status(500).send("Error fetching invoices");
  } finally {
    span.end();
  }
});

app.listen(PORT, () => {
  console.log(`Invoice Service running on port ${PORT}`);
});
