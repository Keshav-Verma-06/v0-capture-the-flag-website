'use client';

import React, { useState, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function PacketAnalysisLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const backHref = challengeId ? `/challenges/${challengeId}` : '/challenges';
  const backText = challengeId ? 'Back to Challenge' : 'Back to Challenges';
  const [answer, setAnswer] = useState('');
  const [showFlag, setShowFlag] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const FLAG = 'flag{packet_found}';
  const CORRECT_API_KEY = 'sk_live_51234567890abcdef';

  const PACKET_DATA = `
Frame 1: 102 bytes on wire (816 bits), 102 bytes captured (816 bits)
    Source: 192.168.1.100
    Destination: 8.8.8.8
    Protocol: HTTP
    
Frame 2: 456 bytes on wire (3648 bits), 456 bytes captured (3648 bits)
    Source: 8.8.8.8
    Destination: 192.168.1.100
    Protocol: TCP
    
Frame 3: 1024 bytes on wire (8192 bits), 1024 bytes captured (8192 bits)
    Source: 192.168.1.100
    Destination: api.payment.com
    Protocol: HTTPS
    [TLS Record: Application Data]
    
Frame 4: 512 bytes on wire (4096 bits), 512 bytes captured (4096 bits)
    Source: api.payment.com
    Destination: 192.168.1.100
    HTTP/1.1 200 OK
    Content-Type: application/json
    
Frame 5: 256 bytes
    Authorization: Bearer sk_live_51234567890abcdef
    Secret-Token: xyzabc123def456
    X-API-Key: sk_live_51234567890abcdef
  `;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSubmitting(true);
    setMessage(null);

    setTimeout(() => {
      if (answer.trim() === CORRECT_API_KEY) {
        setMessage({
          type: 'success',
          text: '✓ Correct! You found the API key in the packet capture!',
        });
        setShowFlag(true);
      } else {
        setMessage({
          type: 'error',
          text: '✗ Incorrect. Analyze the packets carefully to find sensitive information being transmitted.',
        });
        setShowFlag(false);
      }
      setSubmitting(false);
    }, 500);
  };

  const downloadPCAP = () => {
    const content = PACKET_DATA;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'capture.pcap.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href={backHref}>
            <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800">
              ← {backText}
            </Button>
          </Link>
        </div>

        <Card className="bg-slate-800 border-slate-700 mb-6">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                🔍 Forensics
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">Packet Analysis</h1>
            <p className="text-slate-400 mb-6">
              A network traffic capture has been obtained. Analyze the packets to find the hidden API key.
            </p>

            <div className="bg-slate-900/50 border border-slate-700 rounded p-4 mb-6 max-h-48 overflow-y-auto">
              <h3 className="text-sm font-mono text-green-400 mb-2">Packet Capture (PCAP):</h3>
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap break-words">
                {PACKET_DATA}
              </pre>
            </div>

            <h2 className="text-lg font-semibold text-white mb-4">Find the API Key:</h2>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  API Key
                </label>
                <Input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter the API key found in the packets"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                  disabled={submitting}
                />
              </div>

              {message && (
                <div
                  className={`p-4 rounded-md border ${
                    message.type === 'success'
                      ? 'bg-green-500/10 border-green-500/20'
                      : 'bg-red-500/10 border-red-500/20'
                  }`}
                >
                  <p
                    className={
                      message.type === 'success'
                        ? 'text-green-400'
                        : 'text-red-400'
                    }
                  >
                    {message.text}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
                >
                  {submitting ? 'Checking...' : 'Submit Answer'}
                </Button>
                <Button
                  type="button"
                  onClick={downloadPCAP}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2"
                >
                  📥 Download PCAP
                </Button>
              </div>
            </form>

            <div className="border-t border-slate-700 pt-6">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                {showHint ? '▼ Hide' : '▶ Show'} Hint
              </button>

              {showHint && (
                <div className="mt-4 bg-slate-700 rounded p-4 space-y-3">
                  <p className="text-slate-300 text-sm">
                    <strong>Hint 1:</strong> Look for HTTP headers that might contain authentication credentials.
                  </p>
                  <p className="text-slate-300 text-sm">
                    <strong>Hint 2:</strong> Common headers to look for: Authorization, X-API-Key, Secret-Token, API-Key
                  </p>
                  <p className="text-slate-300 text-sm">
                    <strong>Hint 3:</strong> The API key appears to start with 'sk_live_'
                  </p>
                  <p className="text-slate-300 text-sm">
                    <strong>Tools:</strong> Wireshark, tcpdump, or manual packet analysis
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {showFlag && (
          <Card className="bg-green-500/10 border-green-500/20">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-4">🎉 API Key Found!</h2>
              <p className="text-slate-300 mb-4">
                You successfully extracted the API key from the network traffic!
              </p>
              <div className="bg-slate-900/50 border border-green-500/30 rounded p-4 mb-6">
                <p className="text-sm text-slate-400 mb-2">Flag:</p>
                <p className="font-mono text-green-400 text-lg break-all">{FLAG}</p>
              </div>
              <p className="text-sm text-slate-400">
                Copy the flag above and submit it in the challenge page to earn points!
              </p>
            </div>
          </Card>
        )}

        {!showFlag && (
          <Card className="bg-slate-800 border-slate-700">
            <div className="p-8">
              <h3 className="text-lg font-semibold text-white mb-4">💡 Packet Analysis</h3>
              <div className="space-y-4 text-slate-300 text-sm">
                <p>
                  Packet analysis involves examining network traffic to understand communication between systems. It can reveal:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Unencrypted credentials</strong> in HTTP traffic</li>
                  <li><strong>API keys and tokens</strong> in headers</li>
                  <li><strong>Sensitive data</strong> transmitted without encryption</li>
                  <li><strong>DNS queries</strong> revealing accessed domains</li>
                  <li><strong>Chat messages</strong> and communication content</li>
                </ul>
                <p>
                  <strong>Common tools:</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Wireshark - GUI packet analyzer</li>
                  <li>tcpdump - Command-line capture tool</li>
                  <li>tshark - Terminal version of Wireshark</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function PacketAnalysisLab() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <PacketAnalysisLabContent />
    </Suspense>
  );
}
