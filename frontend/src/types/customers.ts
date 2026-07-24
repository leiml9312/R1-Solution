export type OrderStatus = 'Intake' | 'In Progress' | 'Completed';

export interface OrderLineItem {
  partNo: string;
  description: string;
  qty: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNo: string;
  date: string; // YYYY-MM-DD
  status: OrderStatus;
  poNo: string;
  incoterm: string;
  shipMethod: string;
  hsCode: string;
  currency: string;
  lineItems: OrderLineItem[];
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  billingAddress: string;
  phone: string;
  email: string;
  orders: Order[];
}
