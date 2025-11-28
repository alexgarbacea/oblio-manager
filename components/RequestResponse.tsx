'use client';

interface RequestResponseProps {
  request?: unknown;
  response?: unknown;
  error?: string;
}

export default function RequestResponse({ request, response, error }: RequestResponseProps) {
  if (!request && !response && !error) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      {request !== undefined && request !== null && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-blue-600">📤</span>
            Request
          </h3>
          <pre className="bg-white p-4 rounded border border-gray-200 overflow-x-auto text-xs text-gray-800">
            {JSON.stringify(request, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
            <span>❌</span>
            Error
          </h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {response !== undefined && response !== null && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <span className="text-green-600">📥</span>
            Response
          </h3>
          <pre className="bg-white p-4 rounded border border-gray-200 overflow-x-auto text-xs text-gray-800">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
