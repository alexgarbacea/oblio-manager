import { ApiResponse, OblioCredentials } from './types';
import { encryptCredentials, encryptToken } from './crypto';

export class OblioAPI {
  private credentials: OblioCredentials;

  constructor(credentials: OblioCredentials) {
    this.credentials = credentials;
  }

  async authenticate(): Promise<OblioCredentials> {
    const encryptedCredentials = encryptCredentials({
      clientId: this.credentials.clientId,
      clientSecret: this.credentials.clientSecret,
    });

    const response = await fetch('/api/oblio/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ encryptedCredentials }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Authentication failed');
    }

    const tokenData: { access_token: string; expires_in: string } = await response.json();

    if (!tokenData.access_token) {
      throw new Error('Invalid response from server');
    }

    return {
      ...this.credentials,
      accessToken: tokenData.access_token,
      tokenExpiry: Date.now() + parseInt(tokenData.expires_in) * 1000,
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ response: ApiResponse<T>; request: unknown }> {
    if (!this.credentials.accessToken) {
      throw new Error('No access token available');
    }

    const encryptedToken = encryptToken(this.credentials.accessToken);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-encrypted-token': encryptedToken,
      'x-oblio-endpoint': endpoint,
    };

    const response = await fetch('/api/oblio/proxy', {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify({ data: JSON.parse(options.body as string) }) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async getCompanies() {
    return this.request('/nomenclature/companies');
  }

  async getVatRates(cif: string) {
    return this.request(`/nomenclature/vat_rates?cif=${cif}`);
  }

  async getClients(cif: string, offset = 0) {
    return this.request(`/nomenclature/clients?cif=${cif}&offset=${offset}`);
  }

  async getProducts(cif: string, offset = 0) {
    return this.request(`/nomenclature/products?cif=${cif}&offset=${offset}`);
  }

  async getSeries(cif: string) {
    return this.request(`/nomenclature/series?cif=${cif}`);
  }

  async getLanguages() {
    return this.request('/nomenclature/languages');
  }

  async getManagement(cif: string) {
    return this.request(`/nomenclature/management?cif=${cif}`);
  }

  async createInvoice(data: unknown) {
    return this.request('/docs/invoice', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createProforma(data: unknown) {
    return this.request('/docs/proforma', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createNotice(data: unknown) {
    return this.request('/docs/notice', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getInvoice(cif: string, seriesName: string, number: string) {
    return this.request(`/docs/invoice?cif=${cif}&seriesName=${seriesName}&number=${number}`);
  }

  async listInvoices(cif: string, params: Record<string, string> = {}) {
    const queryParams = new URLSearchParams(params);
    return this.request(`/docs/invoice/list?cif=${cif}&${queryParams.toString()}`);
  }

  async collectInvoice(data: unknown) {
    return this.request('/docs/invoice/collect', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async cancelDocument(type: string, data: unknown) {
    return this.request(`/docs/${type}/cancel`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async restoreDocument(type: string, data: unknown) {
    return this.request(`/docs/${type}/restore`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDocument(type: string, cif: string, seriesName: string, number: string) {
    return this.request(`/docs/${type}?cif=${cif}&seriesName=${seriesName}&number=${number}`, {
      method: 'DELETE',
    });
  }

  async sendEInvoice(data: unknown) {
    return this.request('/docs/einvoice', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEInvoice(cif: string, seriesName: string, number: string) {
    return this.request(`/docs/einvoice?cif=${cif}&seriesName=${seriesName}&number=${number}`);
  }

  async listWebhooks() {
    return this.request('/webhooks');
  }

  async createWebhook(data: { cif: string; topic: string; endpoint: string }) {
    return this.request('/webhooks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteWebhook(id: string) {
    return this.request(`/webhooks/${id}`, {
      method: 'DELETE',
    });
  }
}
