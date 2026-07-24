import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import * as records from '../db/records';

const jsonHeaders = { 'Content-Type': 'application/json' };

async function listRecords(_req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  const data = await records.listAll();
  return { status: 200, headers: jsonHeaders, jsonBody: data };
}

async function createRecord(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  const body = (await req.json()) as { name?: string; amount?: number };
  if (!body?.name || typeof body.amount !== 'number') {
    return { status: 400, headers: jsonHeaders, jsonBody: { error: 'name and amount are required' } };
  }
  const created = await records.create({ name: body.name, amount: body.amount });
  return { status: 201, headers: jsonHeaders, jsonBody: created };
}

async function updateRecord(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  const id = req.params.id;
  const body = (await req.json()) as { name?: string; amount?: number };
  if (!body?.name || typeof body.amount !== 'number') {
    return { status: 400, headers: jsonHeaders, jsonBody: { error: 'name and amount are required' } };
  }
  const updated = await records.update(id, { name: body.name, amount: body.amount });
  if (!updated) {
    return { status: 404, headers: jsonHeaders, jsonBody: { error: 'not found' } };
  }
  return { status: 200, headers: jsonHeaders, jsonBody: updated };
}

async function deleteRecord(req: HttpRequest, _ctx: InvocationContext): Promise<HttpResponseInit> {
  const id = req.params.id;
  const ok = await records.remove(id);
  if (!ok) {
    return { status: 404, headers: jsonHeaders, jsonBody: { error: 'not found' } };
  }
  return { status: 204 };
}

app.http('listRecords', { methods: ['GET'], route: 'records', authLevel: 'anonymous', handler: listRecords });
app.http('createRecord', { methods: ['POST'], route: 'records', authLevel: 'anonymous', handler: createRecord });
app.http('updateRecord', {
  methods: ['PUT'],
  route: 'records/{id}',
  authLevel: 'anonymous',
  handler: updateRecord,
});
app.http('deleteRecord', {
  methods: ['DELETE'],
  route: 'records/{id}',
  authLevel: 'anonymous',
  handler: deleteRecord,
});
