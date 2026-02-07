import { Card } from '@/components/ui/card';

export default function BackupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-slate-800 border-slate-700">
          <div className="p-8 font-mono text-sm space-y-3">
            <p className="text-yellow-400">HTTP/1.1 404 Not Found</p>
            <p className="text-slate-400">Server: nginx/1.18.0</p>
            <p className="text-slate-400">Date: Fri, 03 Feb 2026 10:45:00 GMT</p>
            <p className="text-slate-400">Content-Type: text/plain</p>
            <div className="border-t border-slate-700 mt-4 pt-4">
              <p className="text-slate-300">Archive Service (Deprecated)</p>
              <p className="text-slate-400 mt-2 text-xs">This location has been decommissioned.</p>
              <p className="text-slate-500 text-xs mt-1">Configuration data relocated during namespace consolidation.</p>
              <p className="text-slate-600 text-xs mt-3 italic">// Endpoint status: archived</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
