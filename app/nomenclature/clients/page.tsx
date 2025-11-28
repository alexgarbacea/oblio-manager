'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/PageContainer';
import RequestResponse from '@/components/RequestResponse';
import Sidebar from '@/components/Sidebar';

export default function ClientsPage() {
  const { isAuthenticated, getAPI } = useAuth();
  const router = useRouter();
  const [cif, setCif] = useState('');
  const [offset, setOffset] = useState(0);
  const [data, setData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<unknown>(null);
  const [response, setResponse] = useState<unknown>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const loadData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const api = getAPI();
      if (!api) throw new Error('API not initialized');

      const result = await api.getClients(cif, offset);
      setRequest({ cif, offset });
      setResponse(result.response);
      setData(result.response.data as unknown[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load clients');
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
          title="Clients"
          description="Fetch client database (max 250 per request)."
        >
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <form onSubmit={loadData} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company CIF
                  </label>
                  <input
                    type="text"
                    value={cif}
                    onChange={(e) => setCif(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                    placeholder="RO12345678"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Offset (for pagination)
                  </label>
                  <input
                    type="number"
                    value={offset}
                    onChange={(e) => setOffset(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                    min="0"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Get Clients'}
                </button>
              </form>
            </div>

            {data.length > 0 && (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <pre className="bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto text-sm text-gray-800">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <RequestResponse request={request} response={response} error={error} />
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
