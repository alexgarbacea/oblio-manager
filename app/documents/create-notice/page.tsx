'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/PageContainer';
import RequestResponse from '@/components/RequestResponse';
import Sidebar from '@/components/Sidebar';

interface Product {
  name: string;
  quantity: number;
}

export default function CreateNoticePage() {
  const { isAuthenticated, getAPI } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<unknown>(null);
  const [response, setResponse] = useState<unknown>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    cif: '',
    clientCif: '',
    clientName: '',
    seriesName: '',
    issueDate: new Date().toISOString().split('T')[0],
  });

  const [products, setProducts] = useState<Product[]>([{ name: '', quantity: 1 }]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const noticeData = {
      cif: formData.cif,
      client: {
        cif: formData.clientCif,
        name: formData.clientName,
      },
      issueDate: formData.issueDate,
      seriesName: formData.seriesName,
      products,
    };

    try {
      const api = getAPI();
      if (!api) throw new Error('API not initialized');

      const result = await api.createNotice(noticeData);
      setRequest(noticeData);
      setResponse(result.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create notice');
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
          title="Create Delivery Notice"
          description="Issue a new delivery notice through the Oblio API."
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="grid gap-4 md:grid-cols-2">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client CIF *</label>
                  <input
                    type="text"
                    value={formData.clientCif}
                    onChange={(e) => setFormData({ ...formData, clientCif: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date *</label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-gray-900"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Notice'}
            </button>
          </form>

          <RequestResponse request={request} response={response} error={error} />
        </PageContainer>
      </main>
    </div>
  );
}
