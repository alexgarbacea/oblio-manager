'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/PageContainer';
import RequestResponse from '@/components/RequestResponse';
import Sidebar from '@/components/Sidebar';

export default function ManageDocumentsPage() {
  const { isAuthenticated, getAPI } = useAuth();
  const router = useRouter();
  const [operation, setOperation] = useState('view');
  const [documentType, setDocumentType] = useState('invoice');
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

      let result;
      const { cif, seriesName, number } = formData;

      switch (operation) {
        case 'view':
          result = await api.getInvoice(cif, seriesName, number);
          setRequest({ cif, seriesName, number });
          break;
        case 'cancel':
          result = await api.cancelDocument(documentType, { cif, seriesName, number });
          setRequest({ operation: 'cancel', documentType, cif, seriesName, number });
          break;
        case 'restore':
          result = await api.restoreDocument(documentType, { cif, seriesName, number });
          setRequest({ operation: 'restore', documentType, cif, seriesName, number });
          break;
        case 'delete':
          result = await api.deleteDocument(documentType, cif, seriesName, number);
          setRequest({ operation: 'delete', documentType, cif, seriesName, number });
          break;
        default:
          throw new Error('Invalid operation');
      }

      setResponse(result.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
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
          title="Manage Documents"
          description="View, cancel, restore, or delete documents."
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Operation</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                  <select
                    value={operation}
                    onChange={(e) => setOperation(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-gray-900"
                  >
                    <option value="view">View Document</option>
                    <option value="cancel">Cancel Document</option>
                    <option value="restore">Restore Document</option>
                    <option value="delete">Delete Document</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-gray-900"
                  >
                    <option value="invoice">Invoice</option>
                    <option value="proforma">Proforma</option>
                    <option value="notice">Notice</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Details</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company CIF *</label>
                  <input
                    type="text"
                    value={formData.cif}
                    onChange={(e) => setFormData({ ...formData, cif: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-gray-900"
                    placeholder="RO12345678"
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
                    placeholder="FACT"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Number *</label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-gray-900"
                    placeholder="12345"
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
              {loading ? 'Processing...' : `${operation.charAt(0).toUpperCase() + operation.slice(1)} Document`}
            </button>
          </form>

          <RequestResponse request={request} response={response} error={error} />
        </PageContainer>
      </main>
    </div>
  );
}
