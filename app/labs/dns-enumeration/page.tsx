'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DnsEnumerationRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/challenges');
  }, [router]);

  return null;
}

