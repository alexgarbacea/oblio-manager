'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/PageContainer';
import Sidebar from '@/components/Sidebar';

export default function SettingsPage() {
  const { isAuthenticated, credentials, login, logout } = useAuth();
  const router = useRouter();
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [manualToken, setManualToken] = useState('');
  const [tokenExpiry, setTokenExpiry] = useState('3600');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    if (credentials) {
      setClientId(credentials.clientId);
    }
  }, [isAuthenticated, credentials, router]);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await login(clientId, clientSecret);
      setSuccess('Credentials updated and authenticated successfully');
      setClientSecret('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout? All unsaved data will be lost.')) {
      logout();
      router.push('/');
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
          title="Settings"
          description="Manage your Oblio API credentials and access token."
        >
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Status</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Client ID:</span>
                  <span className="text-gray-900 font-medium">{credentials?.clientId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Access Token:</span>
                  <span className="text-gray-900 font-mono text-xs">
                    {credentials?.accessToken ? `${credentials.accessToken.substring(0, 20)}...` : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Token Expires:</span>
                  <span className="text-gray-900">
                    {credentials?.tokenExpiry
                      ? new Date(credentials.tokenExpiry).toLocaleString()
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Update Credentials</h2>
              <form onSubmit={handleUpdateCredentials} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client ID (Email)
                  </label>
                  <input
                    type="email"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Secret
                  </label>
                  <input
                    type="password"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none text-gray-900"
                    placeholder="Enter new secret to update"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update & Re-authenticate'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Danger Zone</h2>
              <p className="text-gray-600 text-sm mb-4">
                Logout will clear all stored credentials and data from your browser.
              </p>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">Security Note</h3>
              <p className="text-sm text-blue-800">
                All credentials are stored locally in your browser&apos;s localStorage. They are never sent to any server
                except the official Oblio API endpoints. This application runs entirely in your browser.
              </p>
            </div>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
