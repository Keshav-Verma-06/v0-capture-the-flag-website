import { Card } from '@/components/ui/card';

export default function DevPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* HTTP Response */}
        <Card className="bg-slate-800 border-slate-700">
          <div className="p-8 font-mono text-sm space-y-3">
            <p className="text-yellow-400">HTTP/1.1 404 Not Found</p>
            <p className="text-slate-400">Server: nginx/1.18.0</p>
            <p className="text-slate-400">Date: Fri, 07 Feb 2026 10:45:00 GMT</p>
            <p className="text-slate-400">Content-Type: text/plain</p>
            <div className="border-t border-slate-700 mt-4 pt-4">
              <p className="text-slate-300">Development Service (Legacy)</p>
              <p className="text-slate-400 mt-2 text-xs">This endpoint has been deprecated.</p>
              <p className="text-slate-500 text-xs mt-1">Service was decommissioned during the v2 infrastructure migration (2024-Q4).</p>
              <p className="text-slate-600 text-xs mt-3 italic">// Decommissioned: 2024-12-01</p>
            </div>
          </div>
        </Card>

        {/* Hint Section */}
        <Card className="bg-slate-800 border-slate-700">
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300">💡 Hint: Versioning Conventions</h3>
            <p className="text-slate-400 text-sm">
              Legacy endpoints are often retired as infrastructure evolves. Organizations typically follow versioning patterns when updating services to indicate enhanced or updated releases.
            </p>
            <p className="text-slate-400 text-sm">
              When you encounter a deprecated endpoint, check for versioned alternatives:
            </p>
            <div className="bg-slate-900 border border-slate-700 rounded p-3 space-y-2">
              <p className="text-slate-400 text-xs font-mono">• /network/dev-v2 (version 2)</p>
              <p className="text-slate-400 text-xs font-mono">• /network/dev2 (alternate naming)</p>
              <p className="text-slate-400 text-xs font-mono">• /network/v2/dev (namespace variation)</p>
              <p className="text-slate-500 text-xs mt-2 italic">Version numbers indicate lifecycle evolution. Often newer versions exist nearby.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
