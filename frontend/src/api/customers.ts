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

export async function createOrder(customerId: string, input: Omit<Order, 'id'>): Promise<Order> {
  const customer = mockCustomers.find((c) => c.id === customerId);
  if (!customer) throw new Error(`Customer ${customerId} not found`);
  const order: Order = { ...input, id: `ord-${Date.now()}` };
  customer.orders = [order, ...customer.orders];
  return order;
}
