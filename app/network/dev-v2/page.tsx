import { Card } from '@/components/ui/card';

export default function DevV2Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* HTTP Response */}
        <Card className="bg-slate-800 border-slate-700">
          <div className="p-8 font-mono text-sm space-y-3">
            <p className="text-green-400">HTTP/1.1 200 OK</p>
            <p className="text-slate-400">Server: node/v16.13.0</p>
            <p className="text-slate-400">Date: Fri, 07 Feb 2026 10:45:00 GMT</p>
            <p className="text-slate-400">Content-Type: text/plain</p>
            <div className="border-t border-slate-700 mt-4 pt-4">
              <p className="text-slate-300">Development Service v2</p>
              <p className="text-slate-400 mt-2 text-xs">Infrastructure migration in progress. Several public services have been relocated.</p>
              <p className="text-slate-400 text-xs mt-1">Public-facing namespace has been deprecated as part of security hardening initiative.</p>
              <p className="text-slate-500 text-xs mt-1">Services now exposed through restricted internal namespaces only.</p>
              <p className="text-slate-600 text-xs mt-3 italic">// Namespace: internal (restricted access)</p>
            </div>
          </div>
        </Card>

        {/* Hint Section */}
        <Card className="bg-slate-800 border-slate-700">
          <div className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-300">💡 Hint: Internal Namespace Conventions</h3>
            <p className="text-slate-400 text-sm">
              During infrastructure migrations, organizations consolidate services under restricted namespaces. These "internal" endpoints typically preserve the original service purpose in their naming structure.
            </p>
            <p className="text-slate-400 text-sm">
              Since this is a development service, look for it under a restricted internal namespace:
            </p>
            <div className="bg-slate-900 border border-slate-700 rounded p-3 space-y-2">
              <p className="text-slate-400 text-xs font-mono">• /network/internal-dev</p>
              <p className="text-slate-400 text-xs font-mono">• /network/internal-flag</p>
              <p className="text-slate-400 text-xs font-mono">• /network/internal/* (where * is service name)</p>
              <p className="text-slate-500 text-xs mt-2 italic">Internal services often expose sensitive debugging information. This is expected in restricted namespaces.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
