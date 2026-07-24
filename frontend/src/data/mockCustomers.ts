import { Customer } from '../types/customers';

// Frontend-only mock data — no backend endpoint exists yet for
// customers/orders. Dates are generated relative to "today" so the
// "orders in the past month" statement pre-fill has something to filter
// regardless of when this is run.
function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export const mockCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'SELTEKA, UAB',
    address: 'Draugystes str. 19, Kaunas, 51230 Lithuania',
    billingAddress: 'Draugystes str. 19, Kaunas, 51230 Lithuania',
    phone: '+370 37 454195',
    email: 'accounts@selteka.example',
    orders: [
      {
        id: 'ord-1',
        orderNo: 'OIK2026061101',
        date: daysAgo(10),
        status: 'Completed',
        poNo: 'UT0003626 / 074',
        incoterm: 'EXW SZ',
        shipMethod: 'By Sea',
        hsCode: '8534009000',
        currency: 'USD',
        lineItems: [
          { partNo: '5061754', description: 'PCB WV5 System-Overview', qty: 30132, unitPrice: 0.21 },
          { partNo: '5061756', description: 'PCB WV5 User Interface', qty: 30096, unitPrice: 0.05 },
        ],
      },
      {
        id: 'ord-2',
        orderNo: 'OIK2026051502',
        date: daysAgo(45),
        status: 'Completed',
        poNo: 'UT0003629 / 027',
        incoterm: 'EXW SZ',
        shipMethod: 'By Sea',
        hsCode: '8534009000',
        currency: 'USD',
        lineItems: [{ partNo: '5161256', description: 'PCB P2479C', qty: 100, unitPrice: 5 }],
      },
      {
        id: 'ord-3',
        orderNo: 'OIK2026070301',
        date: daysAgo(3),
        status: 'In Progress',
        poNo: 'UT0003630 / 001',
        incoterm: 'EXW SZ',
        shipMethod: 'By Air',
        hsCode: '8534009000',
        currency: 'USD',
        lineItems: [{ partNo: '5061754', description: 'PCB WV5 System-Overview', qty: 500, unitPrice: 0.21 }],
      },
      {
        id: 'ord-4',
        orderNo: 'OIK2026070502',
        date: daysAgo(0),
        status: 'Intake',
        poNo: 'UT0003631 / 002',
        incoterm: 'EXW SZ',
        shipMethod: 'By Sea',
        hsCode: '8534009000',
        currency: 'USD',
        lineItems: [{ partNo: '5061756', description: 'PCB WV5 User Interface', qty: 200, unitPrice: 0.05 }],
      },
    ],
  },
  {
    id: 'cust-2',
    name: 'Acme Manufacturing Ltd',
    address: '88 Industrial Rd, Shenzhen, China',
    billingAddress: '1 Finance Ave, Hong Kong',
    phone: '+852 2222 3333',
    email: 'ap@acme.example',
    orders: [
      {
        id: 'ord-5',
        orderNo: 'OIK2026062001',
        date: daysAgo(20),
        status: 'Completed',
        poNo: 'ACME-PO-01',
        incoterm: 'FOB SZ',
        shipMethod: 'By Sea',
        hsCode: '8534009000',
        currency: 'USD',
        lineItems: [{ partNo: '9001234', description: 'Control Board Rev C', qty: 1000, unitPrice: 1.35 }],
      },
      {
        id: 'ord-6',
        orderNo: 'OIK2026071001',
        date: daysAgo(1),
        status: 'Intake',
        poNo: 'ACME-PO-02',
        incoterm: 'FOB SZ',
        shipMethod: 'By Air',
        hsCode: '8534009000',
        currency: 'USD',
        lineItems: [{ partNo: '9001235', description: 'Control Board Rev D', qty: 50, unitPrice: 2.1 }],
      },
    ],
  },
];
