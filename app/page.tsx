'use client';

import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 lg:ml-64">
        <div className="p-6 lg:p-8 mt-16 lg:mt-0">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Oblio Manager
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Your comprehensive interface for managing Oblio API and webhooks.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="text-3xl mb-3">🔗</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Webhooks</h2>
                <p className="text-gray-600 mb-4">
                  Create, manage, and monitor webhooks for real-time event notifications.
                </p>
                <Link
                  href="/webhooks"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Manage Webhooks
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="text-3xl mb-3">📋</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Nomenclature</h2>
                <p className="text-gray-600 mb-4">
                  Access companies, clients, products, VAT rates, and other lookup data.
                </p>
                <Link
                  href="/nomenclature/companies"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Nomenclature
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="text-3xl mb-3">📄</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Documents</h2>
                <p className="text-gray-600 mb-4">
                  Create and manage invoices, proformas, and delivery notices.
                </p>
                <Link
                  href="/documents/create-invoice"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Document
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="text-3xl mb-3">📧</div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">E-Factura (SPV)</h2>
                <p className="text-gray-600 mb-4">
                  Send and retrieve electronic invoices through the SPV system.
                </p>
                <Link
                  href="/einvoice/send"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Manage E-Facturas
                </Link>
              </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Getting Started</h3>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>Use the sidebar to navigate between different sections</li>
                <li>All data is stored locally in your browser</li>
                <li>Your access token will expire after 1 hour</li>
                <li>You can update credentials anytime in Settings</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
