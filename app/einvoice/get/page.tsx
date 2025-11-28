'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/PageContainer';
import RequestResponse from '@/components/RequestResponse';
import Sidebar from '@/components/Sidebar';

export default function GetEInvoicePage() {
  const { isAuthenticated, getAPI } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<unknown>(null);
  const [response, setResponse] = useState<unknown>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    cif: '',
    seriesName: '',
    number: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const api = getAPI();
      if (!api) throw new Error('API not initialized');

      const result = await api.getEInvoice(formData.cif, formData.seriesName, formData.number);
      setRequest(formData);
      setResponse(result.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve E-Factura');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <PageContainer
          title="Get E-Factura from SPV"
          description="Retrieve an electronic invoice from the SPV system."
        >
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company CIF *</label>
                    <input
                      type="text"
                      value={formData.cif}
                      onChange={(e) => setFormData({ ...formData, cif: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Series Name *</label>
                    <input
                      type="text"
                      value={formData.seriesName}
                      onChange={(e) => setFormData({ ...formData, seriesName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-gray-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number *</label>
                    <input
                      type="text"
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-gray-900"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Retrieving...' : 'Get E-Factura'}
                </button>
              </form>
            </div>

            <RequestResponse request={request} response={response} error={error} />
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
