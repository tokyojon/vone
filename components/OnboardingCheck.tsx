'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { usePathname } from 'next/navigation';
import OnboardingModal from './OnboardingModal';

export default function OnboardingCheck() {
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Skip check on public pages
    if (pathname === '/' || pathname === '/auth') {
      setChecking(false);
      return;
    }

    const checkOnboardingStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setChecking(false);
        return;
      }

      setUserId(user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      if (profile && !profile.onboarding_completed) {
        setShowModal(true);
      }
      
      setChecking(false);
    };

    checkOnboardingStatus();
  }, [pathname]);

  if (checking || !userId) return null;
  // Also hide if we are on public pages (double check for render)
  if (pathname === '/' || pathname === '/auth') return null;

  if (showModal) {
    return (
      <OnboardingModal 
        userId={userId} 
        onComplete={() => setShowModal(false)}
        onClose={() => {}} // Prevent closing without completion
      />
    );
  }

  return null;
}
