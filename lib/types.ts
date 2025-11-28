export interface OblioCredentials {
  clientId: string;
  clientSecret: string;
  accessToken?: string;
  tokenExpiry?: number;
}

export interface ApiResponse<T = unknown> {
  status: number;
  statusMessage: string;
  data: T;
}

export interface Webhook {
  id: string;
  cif: string;
  topic: string;
  endpoint: string;
}

export interface Company {
  cif: string;
  name: string;
  type: string;
}

export interface Client {
  cif: string;
  name: string;
  rc: string;
  address: string;
  city: string;
  county: string;
  country: string;
  email: string;
  phone: string;
  vatPayer: boolean;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  description: string;
  price: number;
  vat: number;
  um: string;
}

export interface VatRate {
  id: string;
  name: string;
  percentage: number;
}

export interface DocumentSeries {
  name: string;
  nextNumber: number;
}

export interface Invoice {
  cif: string;
  client: {
    cif: string;
    name: string;
    rc?: string;
    code?: string;
    address?: string;
    city?: string;
    county?: string;
    country?: string;
    email?: string;
    phone?: string;
    contact?: string;
    vatPayer?: boolean;
  };
  issueDate: string;
  dueDate?: string;
  deliveryDate?: string;
  seriesName: string;
  collect?: {
    type: string;
    status?: string;
  };
  referenceDocument?: {
    type: string;
    seriesName: string;
    number: string;
  };
  language?: string;
  precision?: number;
  currency?: string;
  products: InvoiceProduct[];
  issuerName?: string;
  issuerId?: string;
  noticeNumber?: string;
  internalNote?: string;
  deputyName?: string;
  deputyIdentityCard?: string;
  deputyAuto?: string;
  saleDate?: string;
  workStation?: string;
  useStock?: number;
  useETransport?: boolean;
  sendEInvoice?: boolean;
}

export interface InvoiceProduct {
  name: string;
  code?: string;
  description?: string;
  price: number;
  measuringUnit?: string;
  currency?: string;
  vatName?: string;
  vatPercentage?: number;
  vatIncluded?: boolean;
  quantity: number;
  productType?: string;
  discountValue?: number;
  discountPercentage?: number;
}

export interface RequestLog {
  timestamp: Date;
  endpoint: string;
  method: string;
  request: unknown;
  response: ApiResponse;
  success: boolean;
}
