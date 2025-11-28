'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/PageContainer';
import RequestResponse from '@/components/RequestResponse';
import Sidebar from '@/components/Sidebar';

interface Product {
  name: string;
  price: number;
  quantity: number;
  measuringUnit?: string;
  vatPercentage?: number;
}

export default function CreateProformaPage() {
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
    language: 'RO',
  });

  const [products, setProducts] = useState<Product[]>([
    { name: '', price: 0, quantity: 1, measuringUnit: 'buc', vatPercentage: 19 }
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const addProduct = () => {
    setProducts([...products, { name: '', price: 0, quantity: 1, measuringUnit: 'buc', vatPercentage: 19 }]);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const updateProduct = (index: number, field: keyof Product, value: string | number) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const proformaData = {
      cif: formData.cif,
      client: {
        cif: formData.clientCif,
        name: formData.clientName,
      },
      issueDate: formData.issueDate,
      seriesName: formData.seriesName,
      language: formData.language,
      products,
    };

    try {
      const api = getAPI();
      if (!api) throw new Error('API not initialized');

      const result = await api.createProforma(proformaData);
      setRequest(proformaData);
      setResponse(result.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create proforma');
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
          title="Create Proforma"
          description="Issue a new proforma invoice through the Oblio API."
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company CIF *</label>
                  <input
                    type="text"
                    value={formData.cif}
                    onChange={(e) => setFormData({ ...formData, cif: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Series Name *</label>
                  <input
                    type="text"
                    value={formData.seriesName}
                    onChange={(e) => setFormData({ ...formData, seriesName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client CIF *</label>
                  <input
                    type="text"
                    value={formData.clientCif}
                    onChange={(e) => setFormData({ ...formData, clientCif: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date *</label>
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
                  >
                    <option value="RO">Romanian</option>
                    <option value="EN">English</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Products</h2>
                <button
                  type="button"
                  onClick={addProduct}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Product
                </button>
              </div>
              {products.map((product, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-700">Product {index + 1}</h3>
                    {products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProduct(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => updateProduct(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={product.price}
                        onChange={(e) => updateProduct(index, 'price', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={product.quantity}
                        onChange={(e) => updateProduct(index, 'quantity', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">VAT %</label>
                      <input
                        type="number"
                        step="0.01"
                        value={product.vatPercentage}
                        onChange={(e) => updateProduct(index, 'vatPercentage', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Proforma'}
            </button>
          </form>

          <RequestResponse request={request} response={response} error={error} />
        </PageContainer>
      </main>
    </div>
  );
}
