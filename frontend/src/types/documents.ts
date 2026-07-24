export interface InvoiceLineItem {
  poNo: string;
  line: number;
  partNo: string;
  description: string;
  qty: number;
  unitPrice: number;
  dc: string;
}

export interface InvoiceData {
  shipTo: string;
  billTo: string;
  date: string;
  invoiceNo: string;
  terms: { incoterm: string; shipMethod: string; hsCode: string };
  paymentTerm: string;
  remark: string;
  lineItems: InvoiceLineItem[];
}

export interface PackingListLineItem {
  palletNo: string;
  ctnNo: number;
  partNo: string;
  description: string;
  quantity: number;
  netWeight: number;
  grossWeight: number;
  measurement: string;
}

export interface PackingListData {
  shipTo: string;
  billTo: string;
  no: string;
  date: string;
  lineItems: PackingListLineItem[];
}

export interface StatementLineItem {
  date: string;
  invoiceNo: string;
  currency: string;
  amount: number;
  remark: string;
}

export interface StatementData {
  to: string;
  attn: string;
  tel: string;
  date: string;
  from: string;
  paymentTerm: string;
  remark: string;
  lineItems: StatementLineItem[];
}
