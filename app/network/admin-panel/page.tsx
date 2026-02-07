import { Card } from '@/components/ui/card';

export default function AdminPanelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* HTTP Response */}
        <Card className="bg-slate-800 border-slate-700">
          <div className="p-8 font-mono text-sm space-y-3">
            <p className="text-red-400">HTTP/1.1 403 Forbidden</p>
            <p className="text-slate-400">Server: nginx/1.18.0</p>
            <p className="text-slate-400">Date: Fri, 07 Feb 2026 10:45:00 GMT</p>
            <p className="text-slate-400">Content-Type: text/plain</p>
            <div className="border-t border-slate-700 mt-4 pt-4">
              <p className="text-slate-300">Admin Panel</p>
              <p className="text-slate-400 mt-2 text-xs">Access restricted to internal network only.</p>
              <p className="text-slate-500 text-xs mt-1">Only clients from internal IP ranges can access administrative functions.</p>
              <p className="text-slate-600 text-xs mt-3 italic">// Status: Access Denied</p>
            </div>
          </div>
        </Card>

        {/* Hint Section */}
        <Card className="bg-slate-800 border-slate-700">
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300">💡 Hint: Development Endpoints</h3>
            <p className="text-slate-400 text-sm">
              Administrative interfaces are rarely left public. However, organizations often maintain development and testing endpoints for debugging purposes.
            </p>
            <p className="text-slate-400 text-sm">
              Consider exploring common development endpoint naming conventions:
            </p>
            <div className="bg-slate-900 border border-slate-700 rounded p-3 space-y-2">
              <p className="text-slate-400 text-xs font-mono">• /network/dev</p>
              <p className="text-slate-400 text-xs font-mono">• /network/development</p>
              <p className="text-slate-400 text-xs font-mono">• /network/dev-* (e.g., dev-v1, dev-v2, dev-staging)</p>
              <p className="text-slate-500 text-xs mt-2 italic">These patterns are common in DevOps workflows.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
