import { mockCustomers } from '../data/mockCustomers';
import { Customer, Order } from '../types/customers';

// Frontend-only mock data for now — no backend endpoint exists yet for
// customers/orders. These are async so swapping in real HTTP calls later
// (once a backend resource exists) doesn't change any caller.

export async function listCustomers(): Promise<Customer[]> {
  return mockCustomers;
}

export async function getCustomer(customerId: string): Promise<Customer | null> {
  return mockCustomers.find((c) => c.id === customerId) ?? null;
}

export async function listOrders(customerId: string): Promise<Order[]> {
  const customer = await getCustomer(customerId);
  return customer?.orders ?? [];
}

export async function getOrder(customerId: string, orderId: string): Promise<Order | null> {
  const orders = await listOrders(customerId);
  return orders.find((o) => o.id === orderId) ?? null;
}
