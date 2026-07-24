import { Customer, Order } from '../types/customers';
import { InvoiceData } from '../types/documents';

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
