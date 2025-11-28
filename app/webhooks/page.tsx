"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import RequestResponse from "@/components/RequestResponse";
import Sidebar from "@/components/Sidebar";

interface Webhook {
  id: string;
  company: { cif: string };
  topic: string;
  endpoint: string;
}

const WEBHOOK_TOPICS = [
  "stock.update",
  "invoice.draft",
  "invoice.update",
  "invoice.cancel",
  "invoice.collect",
  "proforma.draft",
  "proforma.update",
  "proforma.cancel",
  "notice.draft",
  "notice.update",
  "notice.cancel",
  "tax_receipt.draft",
  "tax_receipt.update",
  "tax_receipt.cancel",
];

export default function WebhooksPage() {
  const { isAuthenticated, getAPI } = useAuth();
  const router = useRouter();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    cif: "",
    topic: "",
    endpoint: "",
  });
  const [request, setRequest] = useState<unknown>(null);
  const [response, setResponse] = useState<unknown>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }
    loadWebhooks();
  }, [isAuthenticated, router]);

  const loadWebhooks = async () => {
    setLoading(true);
    setError("");
    try {
      const api = getAPI();
      if (!api) throw new Error("API not initialized");

      const result = await api.listWebhooks();
      setRequest(null);
      setResponse(result.response);
      setWebhooks(result.response.data as Webhook[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load webhooks");
    } finally {
      setLoading(false);
    }
  };

  const createWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const api = getAPI();
      if (!api) throw new Error("API not initialized");

      const result = await api.createWebhook(formData);
      setRequest(formData);
      setResponse(result.response);
      setFormData({ cif: "", topic: "", endpoint: "" });
      setShowCreateForm(false);
      await loadWebhooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create webhook");
    } finally {
      setLoading(false);
    }
  };

  const deleteWebhook = async (id: string) => {
    if (!confirm("Are you sure you want to delete this webhook?")) return;

    setLoading(true);
    setError("");
    try {
      const api = getAPI();
      if (!api) throw new Error("API not initialized");

      const result = await api.deleteWebhook(id);
      setRequest({ id });
      setResponse(result.response);
      await loadWebhooks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete webhook");
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
          title="Webhooks Management"
          description="Create, view, and manage your Oblio webhooks for real-time event notifications."
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showCreateForm ? "Cancel" : "Create Webhook"}
              </button>
              <button
                onClick={loadWebhooks}
                disabled={loading}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Refresh
              </button>
            </div>

            {showCreateForm && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Create New Webhook
                </h2>
                <form onSubmit={createWebhook} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company CIF
                    </label>
                    <input
                      type="text"
                      value={formData.cif}
                      onChange={(e) =>
                        setFormData({ ...formData, cif: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                      placeholder="RO12345678"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic
                    </label>
                    <select
                      value={formData.topic}
                      onChange={(e) =>
                        setFormData({ ...formData, topic: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                      required
                    >
                      <option value="">Select a topic</option>
                      {WEBHOOK_TOPICS.map((topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endpoint URL
                    </label>
                    <input
                      type="url"
                      value={formData.endpoint}
                      onChange={(e) =>
                        setFormData({ ...formData, endpoint: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                      placeholder="https://your-server.com/webhook"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Must respond with HTTP 200 and echo the X-Oblio-Request-Id
                      header (base64 encoded)
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Create Webhook"}
                  </button>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Active Webhooks
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CIF
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Topic
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Endpoint
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {webhooks.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          {loading ? "Loading..." : "No webhooks configured"}
                        </td>
                      </tr>
                    ) : (
                      webhooks.map((webhook) => (
                        <tr key={webhook.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {webhook.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {webhook.company.cif}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {webhook.topic}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                            {webhook.endpoint}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => deleteWebhook(webhook.id)}
                              disabled={loading}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <RequestResponse
              request={request}
              response={response}
              error={error}
            />
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
