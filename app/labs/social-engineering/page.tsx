'use client';

import React, { useState, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const internalMessages = [
  {
    id: 1,
    from: "IT Security Team",
    to: "All Employees",
    subject: "REMINDER: Never Share Credentials",
    date: "2025-01-10 09:00 AM",
    content: `Dear Team,

This is a friendly reminder that sharing login credentials, access tokens, or any sensitive internal values via email or chat is strictly prohibited.

If you receive any unusual requests, please report them to security@acmecorp.internal immediately.

Stay vigilant.

Best regards,
IT Security Team`
  },
  {
    id: 2,
    from: "Sarah Mitchell <s.mitchell@acmecorp.internal>",
    to: "Tech Support <support@acmecorp.internal>",
    subject: "RE: Printer Access Issue",
    date: "2025-01-11 02:15 PM",
    content: `Hi Support Team,

Thanks for checking on the printer issue. Restarted it again this morning, but it still seems stuck.

Let me know if there's anything else I should try.

Thanks,
Sarah`
  },
  {
    id: 3,
    from: "Mike Johnson <m.johnson@acmecorp.internal>",
    to: "New Hire Onboarding <onboarding@acmecorp.internal>",
    subject: "RE: System Access Request",
    date: "2025-01-11 03:45 PM",
    content: `Hi Team,

I'm starting this week with the backend group and wanted to follow up on access to the staging environment so I can begin onboarding tasks.

Please let me know if you need anything from me.

Thanks,
Mike`
  },
  {
    id: 4,
    from: "David Chen <d.chen@acmecorp.internal>",
    to: "Mike Johnson <m.johnson@acmecorp.internal>",
    subject: "RE: Getting You Unblocked",
    date: "2025-01-12 10:30 AM",
    content: `Hey Mike,

Welcome aboard — the first week is always a bit of a blur.

I know access requests are meant to go through IT, but until they finish setting things up, you should be able to get by with the placeholder we mentioned earlier. It’s named after the little fridge sticker everyone jokes about — Penny — so it should ring a bell.

Once everything’s official, make sure it gets changed.

See you around,
David
`
  },
  {
    id: 5,
    from: "HR Department",
    to: "All Employees",
    subject: "Upcoming Security Training - Mandatory",
    date: "2025-01-12 11:00 AM",
    content: `Dear Colleagues,

As part of our ongoing security initiatives, all employees must complete the annual Security Awareness Training by January 31st.

Topics include:
- Social Engineering Risks
- Password Hygiene
- Sensitive Data Handling
- Incident Reporting

Please access the training through the intranet portal.

Thank you,
HR Department`
  },
  {
    id: 6,
    from: "Lisa Wong <l.wong@acmecorp.internal>",
    to: "Team Leads",
    subject: "Q1 Planning Meeting",
    date: "2025-01-13 09:00 AM",
    content: `Hi Team Leads,

Reminder that our Q1 planning meeting is scheduled for tomorrow at 2 PM in Conference Room B.

Please come prepared with your team goals and priorities.

Best,
Lisa`
  }
];

function SocialEngineeringLabContent() {
  const searchParams = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const backHref = challengeId ? `/challenges/${challengeId}` : '/challenges';
  const backText = challengeId ? 'Back to Challenge' : 'Back to Challenges';
  
  const [answer, setAnswer] = useState('');
  const [showFlag, setShowFlag] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);

  const FLAG = 'flag{soceng_success}';
  const CORRECT_ANSWER = 'penny';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSubmitting(true);
    setMessage(null);

    setTimeout(() => {
      if (answer.trim().toLowerCase() === CORRECT_ANSWER.toLowerCase()) {
        setMessage({
          type: 'success',
          text: '✓ Correct! You identified the leaked sensitive information!',
        });
        setShowFlag(true);
      } else {
        setMessage({
          type: 'error',
          text: '✗ Incorrect. Look carefully for information that should not have been shared.',
        });
        setShowFlag(false);
      }
      setSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
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
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                🎭 Miscellaneous
              </Badge>
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                Hard
              </Badge>
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                50 pts
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">Social Engineering</h1>
            <p className="text-slate-400 mb-6">
              Analyze internal communications and identify leaked sensitive information.
            </p>

            <div className="bg-slate-900/50 border border-slate-700 rounded p-4 mb-6">
              <h3 className="text-sm font-mono text-green-400 mb-2">Scenario:</h3>
              <p className="text-sm text-slate-300">
                You have intercepted a collection of internal emails from ACME Corp. All employees 
                are reminded not to share sensitive information, yet one message does not follow 
                these rules. Find the sensitive information that was unintentionally revealed.
              </p>
            </div>

            {/* Email Client Interface */}
            <div className="bg-slate-900/50 border border-slate-700 rounded mb-6">
              <div className="border-b border-slate-700 p-3">
                <h3 className="text-sm font-mono text-green-400 flex items-center gap-2">
                  📧 ACME Corp Internal Mail System
                </h3>
                <p className="text-slate-500 text-xs mt-1">Inbox - 6 messages</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[400px]">
                {/* Message List */}
                <div className="lg:col-span-1 border-r border-slate-700 overflow-y-auto max-h-[400px]">
                  {internalMessages.map((msg) => (
                    <div 
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg.id)}
                      className={`p-3 border-b border-slate-700 cursor-pointer transition-colors ${
                        selectedMessage === msg.id 
                          ? 'bg-blue-600/20 border-l-4 border-l-blue-500' 
                          : 'hover:bg-slate-700/50'
                      }`}
                    >
                      <p className="text-white font-medium text-xs truncate">{msg.from.split('<')[0].trim()}</p>
                      <p className="text-slate-300 text-xs truncate">{msg.subject}</p>
                      <p className="text-slate-500 text-xs mt-1">{msg.date}</p>
                    </div>
                  ))}
                </div>

                {/* Message Content */}
                <div className="lg:col-span-2 p-4 overflow-y-auto max-h-[400px]">
                  {selectedMessage ? (
                    (() => {
                      const msg = internalMessages.find(m => m.id === selectedMessage);
                      if (!msg) return null;
                      return (
                        <div>
                          <div className="mb-4 pb-3 border-b border-slate-700">
                            <h3 className="text-lg font-bold text-white mb-2">{msg.subject}</h3>
                            <div className="space-y-1 text-xs">
                              <p className="text-slate-300"><span className="text-slate-500">From:</span> {msg.from}</p>
                              <p className="text-slate-300"><span className="text-slate-500">To:</span> {msg.to}</p>
                              <p className="text-slate-300"><span className="text-slate-500">Date:</span> {msg.date}</p>
                            </div>
                          </div>
                          <div className="text-slate-300 whitespace-pre-wrap font-mono text-xs leading-relaxed">
                            {msg.content}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                      <p>Select a message to view its contents</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-white mb-4">What sensitive information was leaked?</h2>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Enter the leaked sensitive value
                </label>
                <Input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter the sensitive information"
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

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
              >
                {submitting ? 'Checking...' : 'Submit Answer'}
              </Button>
            </form>

            <div className="border-t border-slate-700 pt-6">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                {showHint ? '▼ Hide' : '▶ Show'} Hint
              </button>

              {showHint && (
                <div className="mt-4 bg-yellow-500/10 border border-yellow-500/20 rounded p-4">
                  <p className="text-yellow-300 text-sm italic">
                    Not all security breaches rely on technical exploits—sometimes they happen 
                    because someone is trying to be helpful. Look for someone bypassing proper procedures.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {showFlag && (
          <Card className="bg-green-500/10 border-green-500/20">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-green-400 mb-4">🎉 Investigation Successful!</h2>
              <p className="text-slate-300 mb-4">
                You identified the social engineering vulnerability! David shared a temporary access 
                token via email to "help" the new employee, violating security policy. This is a 
                common way sensitive data gets leaked in organizations.
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
      </div>
    </div>
  );
}

export default function SocialEngineeringLab() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <SocialEngineeringLabContent />
    </Suspense>
  );
}
