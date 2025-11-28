'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/PageContainer';
import RequestResponse from '@/components/RequestResponse';
import Sidebar from '@/components/Sidebar';

export default function LanguagesPage() {
  const { isAuthenticated, getAPI } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<unknown>(null);
  const [response, setResponse] = useState<unknown>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    loadData();
  }, [isAuthenticated, router]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const api = getAPI();
      if (!api) throw new Error('API not initialized');

      const result = await api.getLanguages();
      setRequest(null);
      setResponse(result.response);
      setData(result.response.data as unknown[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load languages');
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
          title="Languages"
          description="Available document languages."
        >
          <div className="space-y-6">
            <button
              onClick={loadData}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>

            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6">
                <pre className="bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto text-sm text-gray-800">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </div>

            <RequestResponse request={request} response={response} error={error} />
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
