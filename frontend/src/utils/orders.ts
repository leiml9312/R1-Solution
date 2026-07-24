import type { SelectableOrder as PackingListSelectableOrder } from '../components/documents/PackingListForm';
import type { SelectableOrder as StatementSelectableOrder } from '../components/documents/StatementForm';
import { Customer, Order } from '../types/customers';
import { InvoiceData, PackingListData, StatementData } from '../types/documents';

export function orderTotal(order: Order): number {
  return order.lineItems.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
}

export function isWithinLastMonth(dateStr: string): boolean {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return false;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  return date >= cutoff;
}

export function ordersToPackingListOptions(orders: Order[]): PackingListSelectableOrder[] {
  return orders.map((order) => ({
    id: order.id,
    orderNo: order.orderNo,
    date: order.date,
    lineItems: order.lineItems,
  }));
}

export function ordersToStatementOptions(orders: Order[]): StatementSelectableOrder[] {
  return orders.map((order) => ({
    id: order.id,
    orderNo: order.orderNo,
    date: order.date,
    currency: order.currency,
    amount: orderTotal(order),
    remark: order.status,
  }));
}

export function buildPackingListInitialData(customer: Customer): PackingListData {
  return {
    shipTo: `${customer.name}\n${customer.address}`,
    billTo: `${customer.name}\n${customer.billingAddress}`,
    no: '',
    date: new Date().toISOString().slice(0, 10),
    lineItems: [
      { palletNo: '1', ctnNo: 0, partNo: '', description: '', quantity: 0, netWeight: 0, grossWeight: 0, measurement: '' },
    ],
  };
}

export function buildStatementInitialData(customer: Customer): StatementData {
  const recentOrders = customer.orders.filter((order) => isWithinLastMonth(order.date));
  const lineItems = recentOrders.map((order) => ({
    date: order.date,
    invoiceNo: order.orderNo,
    currency: order.currency,
    amount: orderTotal(order),
    remark: order.status,
  }));
  return {
    to: `${customer.name}\n${customer.address}`,
    attn: '',
    tel: customer.phone,
    date: new Date().toISOString().slice(0, 10),
    from: '',
    paymentTerm: '',
    remark: '',
    lineItems:
      lineItems.length > 0
        ? lineItems
        : [{ date: new Date().toISOString().slice(0, 10), invoiceNo: '', currency: 'USD', amount: 0, remark: '' }],
  };
}

export function orderToInvoiceData(customer: Customer, order: Order): InvoiceData {
  return {
    shipTo: `${customer.name}\n${customer.address}`,
    billTo: `${customer.name}\n${customer.billingAddress}`,
    date: order.date,
    invoiceNo: `INV-${order.orderNo}`,
    terms: { incoterm: order.incoterm, shipMethod: order.shipMethod, hsCode: order.hsCode },
    paymentTerm: '',
    remark: '',
    lineItems: order.lineItems.map((item, index) => ({
      poNo: order.poNo,
      line: index + 1,
      partNo: item.partNo,
      description: item.description,
      qty: item.qty,
      unitPrice: item.unitPrice,
      dc: '',
    })),
  };
}
